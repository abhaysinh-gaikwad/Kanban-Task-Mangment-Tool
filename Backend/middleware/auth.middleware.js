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
const blacklist_model_1 = __importDefault(require("../models/blacklist.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authorization token required" });
        }
        const blacklistedToken = yield blacklist_model_1.default.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ message: "Token has been blacklisted" });
        }
        jsonwebtoken_1.default.verify(token, process.env.jwt_secret || "abhay", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).send({ msg: "Invalid token" });
            }
            try {
                if (payload) {
                    const userId = payload.userId;
                    console.log(userId);
                    const user = yield user_model_1.default.findById(userId);
                    if (user) {
                        req.user = user;
                        next();
                    }
                    else {
                        res.status(400).send({ msg: "User not found" });
                    }
                }
                else {
                    res.status(400).send({ msg: "Invalid token" });
                }
            }
            catch (error) {
                res.status(400).send({ msg: "Error while verifying the token" });
            }
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = auth;
