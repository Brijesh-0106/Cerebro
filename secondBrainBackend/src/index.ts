// ----------------------------------------- Imports
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Document, ObjectId, Schema } from 'mongoose';
// -------------------------------------------

// --------------------------------------------JWT config
let SECRET_KEY = 'IncreaseEfforts'
// -------------------------------------------

// ----------------------------------------- Express Basics
const port = 3000;
const app = express();

declare global {
    namespace Express {
        interface Request {
            userId?: string;
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
        let token = req.header('token');
        if (!token) {
            res.status(403).json({ error: "You don't access for this" })
            return;
        }

        let decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        console.log(decoded, "Decoded");
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
// 
// ----------------------------------------- 

// ----------------------------------------- DB Condig + Connnect
async function DbConnect() {
    await mongoose.connect('mongodb+srv://phenomenal:Phenomenal@cluster0.9ubnr8w.mongodb.net/NeuralNetwork')
    console.log("DB is connected");
}
DbConnect()
// ----------------------------------------- 

// ----------------------------------------- Interface/Models
interface JwtPayload {
    userId: string;
}
interface IUser extends Document {
    name: String,
    email: String,
    password: String
}
interface IContent extends Document {
    title: String,
    type: String,
    tags: Array<String>,
    url: String,
    desc: String,
    userId: ObjectId
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
    type: { type: String, required: true, enum: ["youtube", "twitter"], },
    tags: Array,
    url: { type: String, required: true },
    desc: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ContentModel = mongoose.model<IContent>('content', ContentSchema);
// ----------------------------------------- 


// ----------------------------------------------Signin & Login Routes
app.post('/signin', async (req: Request, res: Response) => {
    let { email, name, password } = req.body;
    console.log(email, name, password);
    await UserModel.create({ name, email, password });
    res.json({
        message: 'Sign in Successfully'
    })
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);
    let user = await UserModel.findOne({ email, password });
    console.log(user);
    if (user) {
        let token = jwt.sign(user._id.toString(), SECRET_KEY)
        res.json({
            message: 'Login in Successfully',
            token: token
        })
    } else {
        res.json({
            message: 'Incorrect credentials'
        })
    }
})
// ----------------------------------------------

// ----------------------------------------------Content Routes
app.post('/add-content', middleAuth, async (req, res) => {
    let { title, desc, type, tags, url } = req.body;
    console.log(title, type, tags, url, desc);
    let user = await ContentModel.create({ title: title, type: type, tags: tags, url: url, desc: desc, userId: new Schema.Types.ObjectId(req.userId) });
    if (user) {
        res.status(201).json({
            message: 'Content added Successfully',
        })
    } else {
        res.status(500).json({
            message: 'Incorrect credentials'
        })
    }
})
// -----------------------------------------------------

// ----------------------------------------------------Server start
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
// ----------------------------------------------------App end