"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Todo', 'Doing', 'Done'], default: "Todo" },
    boardId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Board" },
    subtasks: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "SubTask" }]
}, {
    versionKey: false
});
const TaskModel = mongoose_1.default.model('Task', taskSchema);
exports.default = TaskModel;
