// ----------------------------------------- Imports
import { Pinecone } from '@pinecone-database/pinecone';
import * as cheer from 'cheerio';
import cors from 'cors';
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import Groq from "groq-sdk";
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema, Types } from 'mongoose';
import path from 'path/win32';
import * as z from "zod";
import { getEmbedding } from './hfEmbedding.js';
import { upload, uploadImage } from "./storage.js"; // Note: add .js extension   
import dns from 'dns';
// -------------------------------------------

// --------------------------------------------DOTENV CONFIG
dotenv.config();
// -------------------------------------------

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --------------------------------------------OAUTH2 CONFIG
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
interface GoogleTokenPayload {
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
}
// -------------------------------------------p


// --------------------------------------------VECTOR EMBEDDING CONFIG
let pcIndex;
try {
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
    });
    pcIndex = pc.index({ name: "cerebro-embeddings" });//NEED TO CREATE INDEX IN PINECONE FIRST
} catch (error) {
    console.error('❌ Pinecone initialization failed:', error);
    process.exit(1);
}
// -------------------------------------------


// -------------------------------------------ZOD VALIDATIONS
const SignIn = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
});
const LogIn = z.object({
    password: z.string().min(8),
    email: z.email(),
});
const Content = z.object({
    title: z.string().min(3),
    type: z.enum(['youtube', 'tweet', 'thought', 'article']),
    tags: z.string(),
    url: z.string(),
    imageUrl: z.string(),
    desc: z.string().min(5),
})
const TagSchema = z.object({
    label: z.string(),
    value: z.string(),
    color: z.string()
})
const Article = z.object({
    type: z.enum(['article']),
    tags: z.array(TagSchema),
    url: z.string(),
    desc: z.string().min(5),
})
const Conversation = z.object({
    content: z.string(),
    role: z.enum(['assistant', 'user']),
    timeStamp: z.string(),
})
// ---------------------------------------------------------

// ----------------------------------------- EXPRESS BASICS
const port = 3000;
const app = express();

declare global {
    namespace Express {
        interface Request {
            userId?: String;
            file?: Multer.File;
        }
    }
}
// ----------------------------------------- 

// ----------------------------------------- MIDDLEWARES => (CORS, BODY PARSE)
app.use(cors())
app.use("/uploads", express.static("uploads"));
app.use(express.json())
// AUTH Middleware
const middleAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        let token = req.header('Token') as string;

        if (!token) {
            res.status(403).json({ error: "Authentication token required" })
            return;
        }
        console.log("SECRET_KEY", process.env.SECRET_KEY);
        let payload = jwt.verify(token, process.env.SECRET_KEY as string) as string;
        console.log("req.userId", payload);
        req.userId = payload
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: "Invalid token" });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: "Token expired" });
        } else {
            res.status(500).json({ error: "Authentication failed" });
        }
    }
}
// ----------------------------------------- 

// ----------------------------------------- DB CONFIG + CONNECT
async function DbConnect() {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(process.env.MONGO_URI as string)
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Exit if DB fails
    }
    console.log("CONNECTED to DB");
}
DbConnect()
// ----------------------------------------- 

// ----------------------------------------- INTERFACE/MODELS
interface IUser extends Document {
    name: String,
    email: String,
    password: String
}
interface IContent extends Document {
    title?: String,
    type: "youtube" | "tweet" | "thought" | "article",
    tags: String,
    contentUrl?: String,
    description: String,
    imageUrl?: String,
    createdAt: Date,
    author?: String
    userId: Types.ObjectId;
}
interface IMessage extends Document {
    content: String,
    role: "assistant" | "user",
    timeStamp: String,
    sourceIds?: Array<Types.ObjectId>;
}
interface IConversation extends Document {
    messages: Array<IMessage>
    userId: Types.ObjectId;
}

// -----------------------------------------

// ----------------------------------------- mODELS & SCHEMA
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
})
const UserModel = mongoose.model<IUser>('user', UserSchema);
const ContentSchema = new Schema<IContent>({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["youtube", 'thought', "tweet", "article"], },
    tags: { type: String, required: false },
    contentUrl: { type: String, required: false },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    createdAt: { type: Date, required: true },
    author: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ContentModel = mongoose.model<IContent>('content', ContentSchema);
const ConversationSchema = new Schema<IConversation>({
    messages: {
        type: [{
            content: { type: String, required: true },
            role: { type: String, required: true },
            timeStamp: { type: String, required: true },
            sourceIds: [{ type: Schema.Types.ObjectId, ref: ContentModel, required: false }]
        }], required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ConversationModel = mongoose.model<IConversation>('chat', ConversationSchema);
// ----------------------------------------- 

// Testing purpose

app.get("/test", (req: Request, res: Response) => {
    res.send("Testing...");
})


// ----------------------------------------------SIGNIN & LOGIN ROUTES

app.post("/v0/api/google", async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload() as GoogleTokenPayload;
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        const { email, name, picture, sub: googleId } = payload;
        console.log("Google auth picture:", picture);
        let User = await UserModel.findOne({ email });
        const user = {
            id: googleId,
            email,
            name,
            picture,
        };

        if (User) {

        } else {
            User = await UserModel.create({ name: name || "Google User", email, password: googleId });
        }
        const jwtToken = jwt.sign(
            User._id.toString(),
            process.env.SECRET_KEY!,
        );
        return res.status(200).json({
            success: true,
            token: jwtToken,
            user,
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
})
app.post('/v0/api/signin', async (req: Request, res: Response) => {
    let { name, email, password } = req.body;
    const result = SignIn.safeParse({ name, email, password });
    if (result.success) {
        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    error: 'User already exists'
                });
            }
            await UserModel.create({ name, email, password });
            res.status(200).json({
                message: 'Sign in Successfully'
            })
        } catch (err) {
            console.error('SignIn error:', err);
            res.status(500).json({
                error: 'Failed to create user'
            });
        }
    } else {
        res.status(400).json({
            error: result.error
        })
    }
})

app.post('/v0/api/login', async (req, res) => {
    let { email, password } = req.body;
    const result = LogIn.safeParse({ password, email })
    if (result.success) {
        try {
            let user = await UserModel.findOne({ email, password });
            if (user) {
                console.log("SECRET_KEY", process.env.SECRET_KEY);
                let token = jwt.sign(user._id.toString(), process.env.SECRET_KEY as string);
                res.status(200).json({
                    message: 'Login in Successfully',
                    token: token,
                    name: user.name
                })
            } else {
                res.status(500).json({
                    error: 'Incorrect credentials'
                })
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed'
            });
        }
    } else {
        res.status(400).json({
            message: result.error
        })
    }
})
// ----------------------------------------------

// --------------------------------------------- CONVERSATION ROUTES

app.get('/v0/api/load-chat', middleAuth, async (req, res) => {
    try {
        const existingChat = await ConversationModel.findOne(
            { userId: req.userId },
            { messages: 1, _id: 0 }
        ).populate('messages.sourceIds');
        res.json({
            "messages": existingChat?.messages || []
        })
    } catch (err) {
        res.status(500).json({ err })
    }
})

app.post('/v0/api/add-chat', middleAuth, async (req: Request, res: Response) => {
    let { content, role, timeStamp } = req.body;
    let vectorInput = "";
    const result = Conversation.safeParse({ content, role, timeStamp });
    if (result.success) {
        try {
            vectorInput += `${content}`;
            const vector = await getEmbedding(vectorInput);
            const vectorResult = await pcIndex.namespace(req.userId as string).query({
                vector: vector,
                topK: 2,
                includeMetadata: true,  // ✅ Add this
                includeValues: false     // Don't need the vectors back
            })
            const strongMatches = vectorResult.matches.filter((elem) =>
                elem.score && elem.score > 0.25
            )
            const existingChat = await ConversationModel.findOne({
                userId: req.userId
            })
            let AIResponse;
            if (existingChat) {
                existingChat.messages.push({ content, role: "user", timeStamp } as any)
                if (strongMatches.length > 0) {
                    let sourceIds = strongMatches.map(r => r.id)
                    // Add LLM
                    const sources = await ContentModel.find({
                        _id: { $in: sourceIds }
                    });
                    const sortedSources = sourceIds
                        .map(id => sources.find(s => s._id.toString() === id))
                        .filter(Boolean);
                    // Build context dynamically based on available sources
                    const context = sortedSources.map((s: any, i) =>
                        `Source ${i + 1}: "${s.title}"
                        Description: ${s.description}
                        Type: ${s.type}
                        Tags: ${s.tags}`
                    ).join('\n\n');
                    const completion = await groq.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: `You are a concise assistant.
                                STRICT RULES:
                                - 3-5 sentence overview only
                                - Then medium size bullet points for key concepts
                                - If a bullet point comes from Source 1, add (Source 1) at the end
                                - If a bullet point comes from Source 2, add (Source 2) at the end
                                - If a bullet is general knowledge or you're unsure, don't add a source tag
                                - DO NOT add any "Note:" or disclaimer at end
                                - DO NOT say "based on provided context"
                                - DO NOT mention YouTube or video descriptions
                                - Sound natural and direct

                            You SHOULD cite sources when information clearly comes from them.
                            You should NOT cite sources when you're guessing or unsure.`
                            },
                            {
                                role: "user",
                                content: `Context:\n${context}\n\nQuestion: "${content}"\n\nAnswer honestly based on available context.`
                            }

                        ],
                        model: "llama-3.1-8b-instant",
                        temperature: 0.4,
                        max_tokens: 200
                    })

                    let answer = completion.choices[0].message.content;
                    AIResponse = {
                        role: "asstistant", timeStamp: new Date().toLocaleString(),
                        content: `${answer}`,
                        sourceIds: sortedSources.map((s: any) => s._id)
                    } as any
                    existingChat.messages.push(
                        AIResponse
                    )
                } else {
                    const recentContent = await ContentModel
                        .find({ userId: req.userId })
                        .sort({ createdAt: -1 })
                        .limit(3);
                    if (recentContent.length > 0) {
                        const topics = recentContent.map(c => c.title).join(', ');
                        AIResponse = {
                            role: "assistant", timeStamp: new Date().toLocaleString(),
                            content: `I couldn't find anything about **${content}** in your saved content. You have content about: **${topics}**. Try adding **${content}**-related content first
                                to build your second brain.`,
                            sourceIds: []
                        } as any
                    } else {
                        AIResponse = {
                            role: "assistant", timeStamp: new Date().toLocaleString(),
                            content: `I couldn't find anything about **${content}** in your saved content. Start by adding YouTube videos, tweets, or thoughts 
                                    to build your second brain.`,
                            sourceIds: []
                        } as any
                    }
                    existingChat.messages.push(
                        AIResponse
                    )
                }
                await existingChat?.save();
            }
            else {
                const firstChat = await ConversationModel.create({
                    messages: [{ content, role: "user", timeStamp }],
                    userId: req.userId
                })

                if (strongMatches.length > 0) {
                    let sourceIds = strongMatches.map(r => r.id)
                    // Add LLM
                    const sources = await ContentModel.find({
                        _id: { $in: sourceIds }
                    });
                    const sortedSources = sourceIds
                        .map(id => sources.find(s => s._id.toString() === id))
                        .filter(Boolean);
                    const context = sortedSources.map((s: any, i) =>
                        `Source ${i + 1}: "${s.title}"
                        Description: ${s.description}
                        Type: ${s.type}
                        Tags: ${s.tags}`
                    ).join('\n\n');
                    const completion = await groq.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: `You are a concise assistant.
                                STRICT RULES:
                                - 3-5 sentence overview only
                                - Then medium size bullet points for key concepts
                                - If a bullet point comes from Source 1, add (Source 1) at the end
                                - If a bullet point comes from Source 2, add (Source 2) at the end
                                - If a bullet is general knowledge or you're unsure, don't add a source tag
                                - DO NOT add any "Note:" or disclaimer at end
                                - DO NOT say "based on provided context"
                                - DO NOT mention YouTube or video descriptions
                                - Sound natural and direct

                            You SHOULD cite sources when information clearly comes from them.
                            You should NOT cite sources when you're guessing or unsure.`
                            },
                            {
                                role: "user",
                                content: `Context:\n${context}\n\nQuestion: "${content}"\n\nAnswer honestly based on available context.`
                            }

                        ],
                        model: "llama-3.1-8b-instant",
                        temperature: 0.7,
                        max_tokens: 500
                    })
                    AIResponse = {
                        role: "asstistant", timeStamp: new Date().toLocaleString(),
                        content: `${completion.choices[0].message.content!}`,
                        sourceIds: sortedSources.map((s: any) => s._id)
                    } as any
                    // Add LLM
                    firstChat.messages.push(
                        AIResponse
                    )
                } else {
                    const recentContent = await ContentModel
                        .find({ userId: req.userId })
                        .sort({ createdAt: -1 })
                        .limit(3);
                    if (recentContent.length > 0) {
                        const topics = recentContent.map(c => c.title).join(', ');
                        AIResponse = {
                            role: "assistant", timeStamp: new Date().toLocaleString(),
                            content: `I couldn't find anything about **${content}** in your saved content. You have content about: **${topics}**. Try adding **${content}**-related content first
                                to build your second brain.`,
                            sourceIds: []
                        } as any
                    } else {
                        AIResponse = {
                            role: "assistant", timeStamp: new Date().toLocaleString(),
                            content: `I couldn't find anything about **${content}** in your saved content. Start by adding YouTube videos, tweets, or thoughts 
                                    to build your second brain.`,
                            sourceIds: []
                        } as any
                    }
                    firstChat.messages.push(
                        AIResponse
                    )
                }
                await firstChat?.save();
            }
            AIResponse = await ConversationModel.findOne(
                { userId: req.userId },
                { messages: { $slice: -1 }, _id: 0 }
            ).populate('messages.sourceIds');
            res.status(200).json({
                AIResponse
            })
        } catch (err) {
            console.error('Chat error:', err);
            return res.status(500).json({
                error: 'Search failed. Please try again.'
            });
        }
    }
    else {
        res.status(400).json({
            error: result.error
        })
    }
})
const getArticleImage = ($: any) => {
    let image = null;
    // For OG image, just trust it's high quality and use it as priority
    image = $('meta[property="og:image"]').attr('content');
    if (image) {
        return image; // OG image is explicitly set by the site owner, trust it
    }

    let largestImage = null;
    let maxSize = 0;

    $('img').toArray().forEach((img: any) => {
        const width = parseInt($(img).attr('width') || '0');
        const height = parseInt($(img).attr('height') || '0');
        const size = width * height;
        if (size > maxSize) {
            maxSize = size;
            largestImage = $(img).attr('src');
        }
    });

    return largestImage;
};
// ----------------------------------------------CONTENT ROUTES
app.post('/v0/api/add-web-article', middleAuth, async (req, res) => {
    console.log(req.body, " body")
    let vectorInput = "";
    let { tags, desc, type, url } = req.body;
    try {
        const result = Article.safeParse({ type, tags, url, desc });
        const tagValues = tags.map((tag: any) => tag.value).join(', ');
        if (result.success) {
            let apiRes = await fetch(url);
            const html = await apiRes.text()
            const $ = cheer.load(html)
            const title = $('title').text();
            const image = getArticleImage($);
            const author = $('meta[name="author"]').attr('content')
                || $('.author').text();
            const excerpt = ($('meta[name="description"]').attr('content')
                || $('article p').first().text()).trim()
                .substring(0, 200);   //only for RAG perpose
            const content = await ContentModel.create(
                {
                    imageUrl: image, title: title,
                    type: type, tags: tagValues,
                    contentUrl: url, description: desc,
                    author: author,
                    userId: new mongoose.Types.ObjectId(req.userId as string),
                    createdAt: new Date().toISOString()
                });
            if (content) {
                vectorInput += `User context:\n${desc} \nTitle:\n${title} \nType:\n${type} \nTags:\n${tagValues} \nexcerpt:\n${excerpt}`;
                console.log(vectorInput);
                getEmbedding(vectorInput).then((vector) => {
                    pcIndex.upsert({
                        records: [
                            {
                                id: content._id.toString(),
                                values: vector,
                                metadata: {
                                    userId: req.userId as string,
                                    type: type,
                                    tags: JSON.stringify(tags)
                                },
                            }
                        ],
                        namespace: req.userId as string
                    });
                })
                    .catch(err => console.error('Background embedding error:', err));
                res.status(201).json({
                    message: 'Article added Successfully',
                })
            } else {
                res.status(500).json({
                    message: 'Failed to add article'
                })
            }
        } else {
            res.status(400).json({
                error: result.error
            })
        }
    } catch (err) {
        console.error('Add article error:', err);

        res.status(500).json({
            error: 'Failed to add article'
        });
    }
})
app.post('/v0/api/add-content', middleAuth, upload.single("imageUrl"), async (req, res) => {
    let imageUrl = ''
    let vectorInput = "";
    try {
        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    type: "imageUrl",
                    error: 'Only JPEG, PNG, and WebP allowed.'
                });
            }
            if (req.file.size > 5 * 1024 * 1024) {
                return res.status(400).json({
                    type: "imageUrl",
                    error: 'File too Big. Maximum size is 5MB.'
                });
            }
            imageUrl = await uploadImage(req.file.buffer);
        }
        let { title, desc, type, tags, url } = req.body;

        const result = Content.safeParse({ title, type, tags, url, desc, imageUrl })
        if (result.success) {
            const content = await ContentModel.create({ imageUrl: imageUrl, title: title, type: type, tags: tags, contentUrl: url, description: desc, userId: new mongoose.Types.ObjectId(req.userId as string), createdAt: new Date().toISOString() });
            if (content) {
                vectorInput += `User context:\n${desc} \nTitle:\n${title} \nType:\n${type} \nTags:\n${JSON.stringify(tags)}`;
                console.log(vectorInput);

                getEmbedding(vectorInput).then((vector) => {
                    pcIndex.upsert({
                        records: [
                            {
                                id: content._id.toString(),
                                values: vector,
                                metadata: {
                                    userId: req.userId as string,
                                    type: type,
                                    tags: JSON.stringify(tags)
                                },
                            }
                        ],
                        namespace: req.userId as string
                    });
                })
                    .catch(err => console.error('Background embedding error:', err));
                res.status(201).json({
                    message: 'Content added Successfully',
                })
            } else {
                res.status(500).json({
                    message: 'Failed to add content'
                })
            }
        } else {
            res.status(400).json({
                error: result.error
            })
        }
    } catch (err) {
        console.error('Add content error:', err);

        res.status(500).json({
            error: 'Failed to add content'
        });
    }
})

app.get('/v0/api/get-all-content', middleAuth, async (req, res) => {
    const ObjtId = new mongoose.Types.ObjectId(req.userId as string)
    let AllUserContent = await ContentModel
        .find({ userId: ObjtId })
        .sort({ createdAt: -1 });
    if (AllUserContent) {
        res.status(200).json({
            AllUserContent
        })
    } else {
        res.status(500).json({
            message: null
        })
    }
})

app.get('/v0/api/get-all-youtube-content', middleAuth, async (req, res) => {
    const ObjtId = new mongoose.Types.ObjectId(req.userId as string)
    let AllUserContent = await ContentModel
        .find({ userId: ObjtId, type: "youtube" })
        .sort({ createdAt: -1 });
    if (AllUserContent) {
        res.status(200).json({
            AllUserContent
        })
    } else {
        res.status(500).json({
            message: null
        })
    }
})
app.get('/v0/api/get-all-article-content', middleAuth, async (req, res) => {
    const ObjtId = new mongoose.Types.ObjectId(req.userId as string)
    let AllUserContent = await ContentModel
        .find({ userId: ObjtId, type: "article" })
        .sort({ createdAt: -1 });
    if (AllUserContent) {
        res.status(200).json({
            AllUserContent
        })
    } else {
        res.status(500).json({
            message: null
        })
    }
})

app.get('/v0/api/get-all-tweet-content', middleAuth, async (req, res) => {
    const ObjtId = new mongoose.Types.ObjectId(req.userId as string)
    let AllUserContent = await ContentModel
        .find({ userId: ObjtId, type: "tweet" })
        .sort({ createdAt: -1 });
    if (AllUserContent) {
        res.status(200).json({
            AllUserContent
        })
    } else {
        res.status(500).json({
            message: null
        })
    }
})
// -----------------------------------------------------
app.get('/v0/api/get-all-thoughts', middleAuth, async (req, res) => {
    const ObjtId = new mongoose.Types.ObjectId(req.userId as string)
    let AllUserThoughs = await ContentModel
        .find({ userId: ObjtId, type: "thought" })
        .sort({ createdAt: -1 });
    if (AllUserThoughs) {
        res.status(200).json({
            AllUserThoughs
        })
    } else {
        res.status(500).json({
            message: null
        })
    }
})
// ----------------------------------------------------SERVER START
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
// --------------------------------------------------------------------------------END----------------------------------------------------------------------------------