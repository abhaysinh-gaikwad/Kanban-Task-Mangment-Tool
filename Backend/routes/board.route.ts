import express, { Request, Response } from "express";
import BoardModel from "../models/board.model";
import TaskModel from "../models/task.model";
import SubtaskModel from "../models/subtask.model";
import auth, { AuthRequest } from "./../middleware/auth.middleware";
import dotenv from "dotenv";

dotenv.config();

const boardRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Board
 *   description: Operations related to board management
 */

/**
 * @swagger
 * /board:
 *   post:
 *     summary: Create a new board
 *     description: Create a new board with a name
 *     tags: [Board]
 *     parameters:
 *       - name: name
 *         description: Name of the board
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Board created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 */

boardRouter.post("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const board = new BoardModel({ name, userId });
    await board.save();
    res.status(200).json({ msg: "Board created successfully", board });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

/**
 * @swagger
 * /board:
 *   get:
 *     summary: Get all boards
 *     description: Retrieve all boards of the authenticated user
 *     tags: [Board]
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       '200':
 *         description: Boards fetched successfully
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */

boardRouter.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const boards = await BoardModel.find({ userId });
    res.status(200).json({ msg: "Boards fetched successfully", boards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal server error" });
  }
});

/**
 * @swagger
 * /board/{boardId}:
 *   get:
 *     summary: Get board by ID
 *     description: Retrieve a board by its ID along with its tasks and subtasks
 *     tags: [Board]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         description: ID of the board to retrieve
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Board retrieved successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Board not found
 *       '500':
 *         description: Internal server error
 */

boardRouter.get("/:boardId", auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { boardId } = req.params;

    if (!userId || !boardId) {
      return res
        .status(400)
        .json({ message: "User ID or Board ID not found in request" });
    }

    const board = await BoardModel.findOne({ _id: boardId, userId })
      .populate({
        path: "tasks",
        populate: {
          path: "subtasks",
        },
        options: {
          group: { _id: null, tasks: { $push: "$subtasks" } },
        },
      })
      .exec();

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).send(board);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /board/{boardId}:
 *   delete:
 *     summary: Delete board by ID
 *     description: Delete a board by its ID along with its associated tasks and subtasks
 *     tags: [Board]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         description: ID of the board to delete
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Board and associated data deleted successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Board not found
 *       '500':
 *         description: Internal server error
 */

boardRouter.delete(
  "/:boardId",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?._id;
      const { boardId } = req.params;

      if (!userId || !boardId) {
        return res
          .status(400)
          .json({ message: "User ID or Board ID not found in request" });
      }

      const deletedBoard = await BoardModel.findOneAndDelete({
        _id: boardId,
        userId,
      });

      if (!deletedBoard) {
        return res.status(404).json({ message: "Board not found" });
      }

      await TaskModel.deleteMany({ boardId: deletedBoard._id });

      await SubtaskModel.deleteMany({ taskId: { $in: deletedBoard.tasks } });

      res
        .status(200)
        .json({ message: "Board and associated data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /board/{boardId}:
 *   patch:
 *     summary: Update board by ID
 *     description: Update a board by its ID
 *     tags: [Board]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         description: ID of the board to update
 *         required: true
 *         type: string
 *       - name: name
 *         description: New name for the board
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       '200':
 *         description: Board updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Board not found
 *       '500':
 *         description: Internal server error
 */

boardRouter.patch(
  "/:boardId",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?._id;
      const { boardId } = req.params;

      if (!userId || !boardId) {
        return res
          .status(400)
          .json({ message: "User ID or Board ID not found in request" });
      }

      const board = await BoardModel.findOneAndUpdate(
        { _id: boardId, userId },
        req.body,
        { new: true }
      );

      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      res.status(200).json({ message: "Board updated successfully", board });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default boardRouter;
