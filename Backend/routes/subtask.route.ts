import express, { Request, Response } from "express";
import mongoose from "mongoose";
import SubtaskModel from "../models/subtask.model";
import auth, { AuthRequest } from "./../middleware/auth.middleware";
import dotenv from "dotenv";
import TaskModel from "../models/task.model";

dotenv.config();

const subtaskRouter = express.Router();

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

subtaskRouter.post("/:taskId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, isCompleted } = req.body;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = new SubtaskModel({ title, isCompleted, taskId });
    await subtask.save();

    task.subtasks.push(subtask._id);
    await task.save();

    res.status(200).json({ msg: "Subtask created successfully", subtask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

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

subtaskRouter.get("/:taskId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const subtasks = await SubtaskModel.find({ taskId });
    res.status(200).json({ msg: "Subtasks fetched successfully", subtasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

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

subtaskRouter.patch("/:subtaskId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { subtaskId } = req.params;
    const { title, isCompleted } = req.body;

    const subtaskToUpdate = await SubtaskModel.findById(subtaskId);
    if (!subtaskToUpdate) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    if (title) {
      subtaskToUpdate.title = title;
    }
    if (isCompleted !== undefined) {
      subtaskToUpdate.isCompleted = isCompleted;
    }

    await subtaskToUpdate.save();

    res.status(200).json({
      message: "Subtask updated successfully",
      subtask: subtaskToUpdate,
    });
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

subtaskRouter.delete("/:subtaskId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { subtaskId } = req.params;

    const subtask = await SubtaskModel.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    const task = await TaskModel.findById(subtask.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the subtask ID from the task's subtasks array
    task.subtasks = task.subtasks.filter(
      (subtask) => subtask.toString() !== subtaskId
    );
    await task.save();

    // Delete the subtask
    await SubtaskModel.findByIdAndDelete(subtaskId);

    res.status(200).json({ msg: "Subtask deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

export default subtaskRouter;
