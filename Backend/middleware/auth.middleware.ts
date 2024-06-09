import express, { Request, Response, NextFunction } from "express";
import blacklistModel from "../models/blacklist.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }
    const blacklistedToken = await blacklistModel.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Token has been blacklisted" });
    }
    jwt.verify(
      token,
      process.env.jwt_secret || "abhay",
      async (err, payload) => {
        if (err) {
          return res.status(400).send({ msg: "Invalid token" });
        }
        try {
          if (payload) {
            const userId = (payload as JwtPayload).userId;
            console.log(userId);
            const user = await UserModel.findById(userId);
            if (user) {
              req.user = user;
              next();
            } else {
              res.status(400).send({ msg: "User not found" });
            }
          } else {
            res.status(400).send({ msg: "Invalid token" });
          }
        } catch (error) {
          res.status(400).send({ msg: "Error while verifying the token" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default auth;
