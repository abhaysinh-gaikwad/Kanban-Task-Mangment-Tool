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
const subtask_model_1 = __importDefault(require("../models/subtask.model"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
const task_model_1 = __importDefault(require("../models/task.model"));
dotenv_1.default.config();
const subtaskRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Subtask
 *   description: Operations related to subtasks
 */
/**
 * @swagger
 * /subtask/{taskId}:
 *   post:
 *     summary: Create a new subtask
 *     description: Create a new subtask for a specified task
 *     tags: [Subtask]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task in which the subtask will be created
 *         required: true
 *         type: string
 *       - name: title
 *         in: formData
 *         description: Title of the subtask
 *         required: true
 *         type: string
 *       - name: isCompleted
 *         in: formData
 *         description: Indicates whether the subtask is completed or not
 *         required: true
 *         type: boolean
 *     responses:
 *       '200':
 *         description: Subtask created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Internal server error
 */
subtaskRouter.post("/:taskId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { title, isCompleted } = req.body;
        const task = yield task_model_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const subtask = new subtask_model_1.default({ title, isCompleted, taskId });
        yield subtask.save();
        task.subtasks.push(subtask._id);
        yield task.save();
        res.status(200).json({ msg: "Subtask created successfully", subtask });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal server error" });
    }
}));
/**
 * @swagger
 * /subtask/{taskId}:
 *   get:
 *     summary: Get all subtasks
 *     description: Retrieve all subtasks of a specified task
 *     tags: [Subtask]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to retrieve subtasks from
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Subtasks fetched successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */
subtaskRouter.get("/:taskId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const subtasks = yield subtask_model_1.default.find({ taskId });
        res.status(200).json({ msg: "Subtasks fetched successfully", subtasks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal server error" });
    }
}));
/**
 * @swagger
 * /subtask/{subtaskId}:
 *   patch:
 *     summary: Update a subtask
 *     description: Update a subtask by its ID
 *     tags: [Subtask]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: subtaskId
 *         in: path
 *         description: ID of the subtask to update
 *         required: true
 *         type: string
 *       - name: title
 *         in: formData
 *         description: New title for the subtask
 *         required: false
 *         type: string
 *       - name: isCompleted
 *         in: formData
 *         description: New completion status for the subtask
 *         required: false
 *         type: boolean
 *     responses:
 *       '200':
 *         description: Subtask updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Subtask not found
 *       '500':
 *         description: Internal server error
 */
subtaskRouter.patch("/:subtaskId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subtaskId } = req.params;
        const { title, isCompleted } = req.body;
        const subtaskToUpdate = yield subtask_model_1.default.findById(subtaskId);
        if (!subtaskToUpdate) {
            return res.status(404).json({ message: "Subtask not found" });
        }
        if (title) {
            subtaskToUpdate.title = title;
        }
        if (isCompleted !== undefined) {
            subtaskToUpdate.isCompleted = isCompleted;
        }
        yield subtaskToUpdate.save();
        res.status(200).json({
            message: "Subtask updated successfully",
            subtask: subtaskToUpdate,
        });
    }
    catch (error) {
        console.error("Error updating subtask:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
/**
 * @swagger
 * /subtask/{subtaskId}:
 *   delete:
 *     summary: Delete a subtask
 *     description: Delete a subtask by its ID
 *     tags: [Subtask]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: subtaskId
 *         in: path
 *         description: ID of the subtask to delete
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Subtask deleted successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Subtask not found
 *       '500':
 *         description: Internal server error
 */
subtaskRouter.delete("/:subtaskId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subtaskId } = req.params;
        const subtask = yield subtask_model_1.default.findById(subtaskId);
        if (!subtask) {
            return res.status(404).json({ message: "Subtask not found" });
        }
        const task = yield task_model_1.default.findById(subtask.taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Remove the subtask ID from the task's subtasks array
        task.subtasks = task.subtasks.filter((subtask) => subtask.toString() !== subtaskId);
        yield task.save();
        // Delete the subtask
        yield subtask_model_1.default.findByIdAndDelete(subtaskId);
        res.status(200).json({ msg: "Subtask deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal server error" });
    }
}));
exports.default = subtaskRouter;
