"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const boardSchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    tasks: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Task" }],
    boardId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Board" }
}, {
    versionKey: false
});
const BoardModel = mongoose_1.default.model('Board', boardSchema);
exports.default = BoardModel;
