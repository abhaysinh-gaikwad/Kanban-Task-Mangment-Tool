import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklist.model";
import auth from "../middleware/auth.middleware";

const userRouter = express.Router();

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

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    res.status(200).json({ message: "New user registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "user not found please register" });
    }
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user?._id },
      process.env.jwt_secret || "abhay"
    );
    const refreshToken = jwt.sign(
      { userId: user?._id },
      process.env.jwt_secret || "abhay"
    );
    res.status(200).send({ msg: "login successful", token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

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

userRouter.get("/logout", auth, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ msg: "Authorization token required" });
    }

    const blacklistToken = new blacklistModel({ token });
    await blacklistToken.save();
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
