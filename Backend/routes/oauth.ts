import express ,  { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import UserModel from "../models/user.model";


const oauthRouter = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
oauthRouter.post("/signup", async (req: Request, res: Response) => {
    const { provider, id_token } = req.body;
    if (!provider || !id_token) {
        return res.status(400).json({ message: "provider and id_token are required" });
    }

    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
    } catch (error) {
        return res.status(400).json({ message: "Failed to verify idToken" });
    }

    if (!ticket) {
        return res.status(400).json({ message: "Invalid idToken" });
    }

    const payload = ticket.getPayload();

    if (!payload) {
        return res.status(400).json({ message: "payload not found" });
    }

    const user = await UserModel.findOne({ email: payload.email });

    if (user) {
        return res.status(400).json({ message: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
        (payload.picture || '').toString(), 
        salt
    );
    const newUser = new UserModel({
        name: payload.name,
        email: payload.email,
        password: hashedPassword
    });

    await newUser.save();

    res.status(200).json({
        message: "user created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

