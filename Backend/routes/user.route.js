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
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blacklist_model_1 = __importDefault(require("../models/blacklist.model"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const userRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to user management
 */
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with name, email, and password
 *     tags: [User]
 *     parameters:
 *       - name: name
 *         description: User's name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request
 */
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        const user = new user_model_1.default({ name, email, password: hashedPassword });
        yield user.save();
        res.status(200).json({ message: "New user registered successfully" });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login
 *     description: Login with email and password
 *     tags: [User]
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Bad request
 */
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: "user not found please register" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id }, process.env.jwt_secret || "abhay");
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id }, process.env.jwt_secret || "abhay");
        res.status(200).send({ msg: "login successful", token, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout
 *     description: Logout the user
 *     tags: [User]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Logout successful
 *       '400':
 *         description: Bad request
 */
userRouter.get("/logout", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(400).json({ msg: "Authorization token required" });
        }
        const blacklistToken = new blacklist_model_1.default({ token });
        yield blacklistToken.save();
        res.status(200).json({ message: "logout successful" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = userRouter;
