"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------- Imports
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mongoose_1 = __importStar(require("mongoose"));
// -------------------------------------------
// --------------------------------------------JWT config
var SECRET_KEY = 'IncreaseEfforts';
// -------------------------------------------
// ----------------------------------------- Express Basics
var port = 3000;
var app = (0, express_1.default)();
// ----------------------------------------- 
// ----------------------------------------- Middleware => (CORS, Body Parse)
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// AUTH Middleware
var middleAuth = function (req, res, next) {
    // console.log(req.header('token'))
    var token = req.header('token');
    if (!token)
        return res.status(403).json({ error: "You don't access for this" });
    var decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
    if (decoded) {
        console.log(decoded, "Decoded");
        req.userId = decoded;
        next();
    }
    else {
        return res.status(401).json({ error: "Invalid Session" });
    }
};
// 
// ----------------------------------------- 
// ----------------------------------------- DB Condig + Connnect
function DbConnect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.connect('mongodb+srv://phenomenal:Phenomenal@cluster0.9ubnr8w.mongodb.net/NeuralNetwork')];
                case 1:
                    _a.sent();
                    console.log("DB is connected");
                    return [2 /*return*/];
            }
        });
    });
}
DbConnect();
// ----------------------------------------- 
// ----------------------------------------- Models & Schema
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
var UserModel = mongoose_1.default.model('user', UserSchema);
var ContentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    tags: Array,
    url: { type: String, required: true },
    desc: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: UserModel, required: true },
});
var ContentModel = mongoose_1.default.model('content', ContentSchema);
// ----------------------------------------- 
// ----------------------------------------------Signin & Login Routes
app.post('/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, password;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                name = req.body.name;
                password = req.body.password;
                console.log(email, name, password);
                return [4 /*yield*/, UserModel.create({ name: name, email: email, password: password })];
            case 1:
                _a.sent();
                res.json({
                    message: 'Sign in Successfully'
                });
                return [2 /*return*/];
        }
    });
}); });
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                password = req.body.password;
                console.log(email, password);
                return [4 /*yield*/, UserModel.findOne({ email: email, password: password })];
            case 1:
                user = _a.sent();
                console.log(user);
                if (user) {
                    token = jsonwebtoken_1.default.sign(user._id.toString(), SECRET_KEY);
                    res.json({
                        message: 'Login in Successfully',
                        token: token
                    });
                }
                else {
                    res.json({
                        message: 'Incorrect credentials'
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
// ----------------------------------------------
// ----------------------------------------------Content Routes
app.post('/add-content', middleAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, desc, type, tags, url, userId, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.body.title;
                desc = req.body.desc;
                type = req.body.type;
                tags = req.body.tags;
                url = req.body.url;
                console.log(title, type, tags, url, desc);
                userId = req.userId;
                return [4 /*yield*/, ContentModel.create({ title: title, type: type, tags: tags, url: url, desc: desc, userId: userId })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.status(201).json({
                        message: 'Content added Successfully',
                    });
                }
                else {
                    res.status(500).json({
                        message: 'Incorrect credentials'
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
// -----------------------------------------------------
// ----------------------------------------------------Server start
app.listen(port, function () {
    console.log('Server is running on port ' + port);
});
// ----------------------------------------------------App end
