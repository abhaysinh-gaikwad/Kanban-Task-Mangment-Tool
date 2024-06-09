"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subtaskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    taskId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Task" }
}, {
    versionKey: false
});
const SubtaskModel = mongoose_1.default.model('SubTask', subtaskSchema);
exports.default = SubtaskModel;
