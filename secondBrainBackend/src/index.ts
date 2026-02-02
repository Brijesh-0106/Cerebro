// ----------------------------------------- Imports
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema, Types } from 'mongoose';
import * as z from "zod";
const { upload } = require("../config/storage");
// -------------------------------------------

// --------------------------------------------JWT config
let SECRET_KEY = 'IncreaseEfforts'
// -------------------------------------------

// -------------------------------------------ZOD validations
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
    title: z.string().max(3),
    type: z.enum(['youtube', 'tweet']),
    tags: z.array(z.object(z.string())),
    url: z.string(),
    desc: z.string().max(5),
})
const Thought = z.object({
    title: z.string().max(3),
    tags: z.array(z.object(z.string())),
    imageUrl: z.string(),
    desc: z.string().max(5),
})
// ---------------------------------------------------------

// ----------------------------------------- Express Basics
const port = 3000;
const app = express();

declare global {
    namespace Express {
        interface Request {
            userId?: String;
            file?: String;
        }
    }
}
// ----------------------------------------- 

// ----------------------------------------- Middleware => (CORS, Body Parse)
app.use(cors())
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

// ----------------------------------------- DB Condig + Connnect
async function DbConnect() {
    await mongoose.connect('mongodb+srv://phenomenal:Phenomenal@cluster0.9ubnr8w.mongodb.net/NeuralNetwork')
    console.log("DB is connected");
}
DbConnect()
// ----------------------------------------- 

// ----------------------------------------- Interface/Models
interface IUser extends Document {
    name: String,
    email: String,
    password: String
}
interface IContent extends Document {
    title: String,
    type: String,
    tags: Array<String>,
    contentUrl: String,
    description: String,
    createdAt: Date,
    userId: Types.ObjectId;
}
interface IThought extends Document {
    title: String,
    tags: Array<String>,
    imageUrl: String,
    description: String,
    createdAt: Date,
    userId: Types.ObjectId;
}
// -----------------------------------------

// ----------------------------------------- Models & Schema
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
})
const UserModel = mongoose.model<IUser>('user', UserSchema);
const ContentSchema = new Schema<IContent>({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["youtube", "tweet"], },
    tags: Array,
    contentUrl: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ContentModel = mongoose.model<IContent>('content', ContentSchema);
const ThoughtSchema = new Schema<IThought>({
    title: { type: String, required: true },
    tags: Array,
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ThoughtModel = mongoose.model<IThought>('thought', ThoughtSchema);
// ----------------------------------------- 


// ----------------------------------------------Signin & Login Routes
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

// ----------------------------------------------Content Routes
app.post('/v0/api/add-content', middleAuth, async (req, res) => {
    console.log("-----------add-content API")
    let { title, desc, type, tags, url } = req.body;
    console.log(title, type, tags, url, desc);
    console.log(req.userId);
    const result = Content.safeParse({ title, type, tags, url, desc })
    if (result.success) {
        let user = await ContentModel.create({ title: title, type: type, tags: tags, contentUrl: url, description: desc, userId: new mongoose.Types.ObjectId(req.userId as string), createdAt: new Date().toDateString() });
        if (user) {
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
    let AllUserContent = await ContentModel.find({ userId: ObjtId });
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

// -------------------------------------------- Though routes
app.post('/v0/api/add-thought', middleAuth, upload.single("image"), async (req, res) => {
    try {
        const image = req.file;
        console.log("File:", image);
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        const { title, desc, type, tags } = req.body;
        const result = Thought.safeParse({ title, desc, type, tags, imageUrl });
        if (result.success) {
            await ThoughtModel.create({ title, description: desc, tags, imageUrl })
            res.status(201).json({ message: 'Content added Successfully' })
        } else {
            res.status(400).json({
                error: result.error
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
})
app.get('/v0/api/get-all-thoughts', middleAuth, async (req, res) => {
    console.log("-----------get-all-thoughts API")
    const ObjtId = new mongoose.Types.ObjectId(req.userId as string)
    let AllUserThoughs = await ThoughtModel.find({ userId: ObjtId });
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
// ----------------------------------------------------Server start
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
// ----------------------------------------------------App end