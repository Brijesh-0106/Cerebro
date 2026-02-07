// ----------------------------------------- Imports
import { Pinecone } from '@pinecone-database/pinecone';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema, Types } from 'mongoose';
import * as z from "zod";
import { PineconeKey, SECRET_KEY } from './Config/key.js';
import { getEmbedding } from './hfEmbedding.js';
import { upload } from "./storage.js"; // Note: add .js extension
// -------------------------------------------

// --------------------------------------------VECTOR EMBEDDING CONFIG
const pc = new Pinecone({
    apiKey: PineconeKey
});
const pcIndex = pc.index({ name: "cerebro-embeddings" });//NEED TO CREATE INDEX IN PINECONE FIRST
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
    type: z.enum(['youtube', 'tweet', 'thought']),
    tags: z.string(),
    url: z.string(),
    imageUrl: z.string(),
    desc: z.string().min(5),
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

        console.log(req.header('Token'))
        if (!token) {
            res.status(403).json({ error: "You don't access for this" })
            return;
        }

        let payload = jwt.verify(token, SECRET_KEY) as string;
        req.userId = payload
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
// ----------------------------------------- 

// ----------------------------------------- DB CONFIG + CONNECT
async function DbConnect() {
    await mongoose.connect('mongodb+srv://phenomenal:Phenomenal@cluster0.9ubnr8w.mongodb.net/NeuralNetwork')
    console.log("DB is connected");
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
    title: String,
    type: "youtube" | "tweet" | "thought",
    tags: String,
    contentUrl?: String,
    description: String,
    imageUrl?: String,
    createdAt: Date,
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
    type: { type: String, required: true, enum: ["youtube", 'thought', "tweet"], },
    tags: { type: String, required: false },
    contentUrl: { type: String, required: false },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    createdAt: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ContentModel = mongoose.model<IContent>('content', ContentSchema);
// ----------------------------------------- 


// ----------------------------------------------SIGNIN & LOGIN ROUTES
app.post('/v0/api/signin', async (req: Request, res: Response) => {
    console.log("reached here", req.body)
    let { name, email, password } = req.body;
    console.log(name, email, password);
    debugger
    const result = SignIn.safeParse({ name, email, password });
    if (result.success) {
        await UserModel.create({ name, email, password });
        res.status(200).json({
            message: 'Sign in Successfully'
        })
    } else {
        res.status(400).json({
            error: result.error
        })
    }
})

app.post('/v0/api/login', async (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);
    const result = LogIn.safeParse({ password, email })
    if (result.success) {
        let user = await UserModel.findOne({ email, password });
        console.log(user);
        if (user) {
            let token = jwt.sign(user._id.toString(), SECRET_KEY)
            res.status(200).json({
                message: 'Login in Successfully',
                token: token
            })
        } else {
            res.status(500).json({
                error: 'Incorrect credentials'
            })
        }
    } else {
        res.status(400).json({
            message: result.error
        })
    }
})
// ----------------------------------------------

// ----------------------------------------------CONTENT ROUTES
app.post('/v0/api/add-content', middleAuth, upload.single("imageUrl"), async (req, res) => {
    console.log("-----------add-content API")
    let imageUrl = ''
    let vectorInput = "";
    if (req.file) {
        const image = req.file;
        console.log("File:", image);
        imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }
    let { title, desc, type, tags, url } = req.body;
    console.log(title, type, tags, url, desc);
    console.log(req.userId);
    const result = Content.safeParse({ title, type, tags, url, desc, imageUrl })
    if (result.success) {
        vectorInput += `User context:\n${desc} \nTitle:\n${title} \nType:\n${type} \nTags:\n${JSON.stringify(tags)}`;
        const vector = await getEmbedding(vectorInput);
        const content = await ContentModel.create({ imageUrl: imageUrl, title: title, type: type, tags: tags, contentUrl: url, description: desc, userId: new mongoose.Types.ObjectId(req.userId as string), createdAt: new Date().toISOString() });
        if (content) {
            await pcIndex.upsert({
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
            res.status(201).json({
                message: 'Content added Successfully',
            })
        } else {
            res.status(500).json({
                message: 'Incorrect credentials'
            })
        }
    } else {
        res.status(400).json({
            error: result.error
        })
    }
})

app.get('/v0/api/get-all-content', middleAuth, async (req, res) => {
    console.log("-----------get-all-content API")
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
    console.log("-----------get-all-youtube-content API")
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

app.get('/v0/api/get-all-tweet-content', middleAuth, async (req, res) => {
    console.log("-----------get-all-tweeter-content API")
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
    console.log("-----------get-all-thoughts API")
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