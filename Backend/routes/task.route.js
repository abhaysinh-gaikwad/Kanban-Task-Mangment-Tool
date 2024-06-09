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
const task_model_1 = __importDefault(require("./../models/task.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
const board_model_1 = __importDefault(require("../models/board.model"));
const subtask_model_1 = __importDefault(require("../models/subtask.model"));
dotenv_1.default.config();
const taskRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Operations related to tasks
 */
/**
 * @swagger
 * /task/{boardId}:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task in a specified board
 *     tags: [Task]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         description: ID of the board in which the task will be created
 *         required: true
 *         type: string
 *       - name: title
 *         in: formData
 *         description: Title of the task
 *         required: true
 *         type: string
 *       - name: description
 *         in: formData
 *         description: Description of the task
 *         required: false
 *         type: string
 *       - name: status
 *         in: formData
 *         description: Status of the task
 *         required: true
 *         type: string
 *       - name: subtaskId
 *         in: formData
 *         description: ID of the subtask associated with the task
 *         required: false
 *         type: string
 *     responses:
 *       '200':
 *         description: Task created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Board not found
 *       '500':
 *         description: Internal server error
 */
taskRouter.post("/:boardId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, subtaskId } = req.body;
    const { boardId } = req.params;
    try {
        const task = new task_model_1.default({
            title,
            description,
            status,
            subtaskId,
            boardId,
        });
        yield task.save();
        const board = yield board_model_1.default.findById(boardId);
        if (!board) {
            res.status(404).json({ message: "Board not found" });
        }
        board === null || board === void 0 ? void 0 : board.tasks.push(task._id);
        yield (board === null || board === void 0 ? void 0 : board.save());
        res.status(200).json({ msg: "Task created successfully", task });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal server error" });
    }
}));
/**
 * @swagger
 * /task/{boardId}:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks of a specified board
 *     tags: [Task]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         description: ID of the board to retrieve tasks from
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Tasks fetched successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */
taskRouter.get("/:boardId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.params;
        const tasks = yield task_model_1.default.find({ boardId });
        res.status(200).json({ msg: "Tasks fetched successfully", tasks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal server error" });
    }
}));
/**
 * @swagger
 * /task/{taskId}:
 *   patch:
 *     summary: Update a task
 *     description: Update a task by its ID
 *     tags: [Task]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to update
 *         required: true
 *         type: string
 *       - name: title
 *         in: formData
 *         description: New title for the task
 *         required: false
 *         type: string
 *       - name: description
 *         in: formData
 *         description: New description for the task
 *         required: false
 *         type: string
 *       - name: status
 *         in: formData
 *         description: New status for the task
 *         required: false
 *         type: string
 *     responses:
 *       '200':
 *         description: Task updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Internal server error
 */
taskRouter.patch("/:taskId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: " Task ID not found in request" });
        }
        const taskToUpdate = yield task_model_1.default.findOne({ _id: taskId });
        if (!taskToUpdate) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (title) {
            taskToUpdate.title = title;
        }
        if (description) {
            taskToUpdate.description = description;
        }
        if (status) {
            taskToUpdate.status = status;
        }
        yield taskToUpdate.save();
        res
            .status(200)
            .json({ message: "Task updated successfully", task: taskToUpdate });
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
/**
 * @swagger
 * /task/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete a task by its ID
 *     tags: [Task]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to delete
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Task deleted successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Task not found
 *       '500':
 *         description: Internal server error
 */
taskRouter.delete("/:taskId", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const taskObjectId = new mongoose_1.default.Types.ObjectId(taskId);
        const task = yield task_model_1.default.findById(taskObjectId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const board = yield board_model_1.default.findOne({ tasks: taskObjectId });
        if (!board) {
            return res.status(404).json({ message: "Board not found for the task" });
        }
        board.tasks = board.tasks.filter((task) => task.toHexString() !== taskId);
        yield board.save();
        yield task_model_1.default.deleteOne({ _id: taskObjectId });
        yield subtask_model_1.default.deleteMany({ taskId: taskObjectId });
        res.status(200).json({ message: "Task deleted successfully", task });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal server error" });
    }
}));
exports.default = taskRouter;
