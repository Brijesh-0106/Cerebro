// ----------------------------------------- Imports
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
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
const middleAuth = (req, res, next) => {
    // console.log(req.header('token'))
    let token = req.header('token');
    if (!token) return res.status(403).json({ error: "You don't access for this" })
    let decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
        console.log(decoded, "Decoded");
        req.userId = decoded
        next();
    } else {
        return res.status(401).json({ error: "Invalid Session" })
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

// ----------------------------------------- Models & Schema
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
})
const UserModel = mongoose.model('user', UserSchema);
const ContentSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    tags: Array,
    url: { type: String, required: true },
    desc: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
})
const ContentModel = mongoose.model('content', ContentSchema);
// ----------------------------------------- 


// ----------------------------------------------Signin & Login Routes
app.post('/signin', async (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    console.log(email, name, password);
    await UserModel.create({ name, email, password });
    res.json({
        message: 'Sign in Successfully'
    })
})

app.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
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
    let title = req.body.title;
    let desc = req.body.desc;
    let type = req.body.type;
    let tags = req.body.tags;
    let url = req.body.url;
    console.log(title, type, tags, url, desc);
    let userId = req.userId
    let user = await ContentModel.create({ title, type, tags, url, desc, userId });
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