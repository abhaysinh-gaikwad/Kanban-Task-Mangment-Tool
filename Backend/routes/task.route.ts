import express, { Request, Response } from "express";
import TaskModel from "./../models/task.model";
import mongoose from "mongoose";
import auth, { AuthRequest } from "./../middleware/auth.middleware";
import dotenv from "dotenv";
import BoardModel from "../models/board.model";
import SubtaskModel from "../models/subtask.model";

dotenv.config();

const taskRouter = express.Router();

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

taskRouter.post("/:boardId", auth, async (req: Request, res: Response) => {
  const { title, description, status, subtaskId } = req.body;
  const { boardId } = req.params;
  try {
    const task = new TaskModel({
      title,
      description,
      status,
      subtaskId,
      boardId,
    });
    await task.save();

    const board = await BoardModel.findById(boardId);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
    }
    board?.tasks.push(task._id);
    await board?.save();
    res.status(200).json({ msg: "Task created successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

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

taskRouter.get("/:boardId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const tasks = await TaskModel.find({ boardId });
    res.status(200).json({ msg: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

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

taskRouter.patch("/:taskId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: " Task ID not found in request" });
    }

    const taskToUpdate = await TaskModel.findOne({ _id: taskId });

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

    await taskToUpdate.save();

    res
      .status(200)
      .json({ message: "Task updated successfully", task: taskToUpdate });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

taskRouter.delete("/:taskId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const taskObjectId = new mongoose.Types.ObjectId(taskId);

    const task = await TaskModel.findById(taskObjectId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await BoardModel.findOne({ tasks: taskObjectId });

    if (!board) {
      return res.status(404).json({ message: "Board not found for the task" });
    }

    board.tasks = board.tasks.filter((task) => task.toHexString() !== taskId);
    await board.save();

    await TaskModel.deleteOne({ _id: taskObjectId });

    await SubtaskModel.deleteMany({ taskId: taskObjectId });

    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

export default taskRouter;
