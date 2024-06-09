"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("../models/user.model"));
const oauthRouter = express_1.default.Router();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
oauthRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provider, id_token } = req.body;
    if (!provider || !id_token) {
        return res.status(400).json({ message: "provider and id_token are required" });
    }
    let ticket;
    try {
        ticket = yield client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
    }
    catch (error) {
        return res.status(400).json({ message: "Failed to verify idToken" });
    }
    if (!ticket) {
        return res.status(400).json({ message: "Invalid idToken" });
    }
    const payload = ticket.getPayload();
    if (!payload) {
        return res.status(400).json({ message: "payload not found" });
    }
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (user) {
        return res.status(400).json({ message: "user already exists" });
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash((payload.picture || '').toString(), salt);
    const newUser = new user_model_1.default({
        name: payload.name,
        email: payload.email,
        password: hashedPassword
    });
    yield newUser.save();
    res.status(200).json({
        message: "user created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
}));
