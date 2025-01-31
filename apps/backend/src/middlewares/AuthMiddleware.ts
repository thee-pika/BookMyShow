import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
dotenv.config();

export const AuthMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1] || req.cookies?.access_token;

        if (!token) {
            console.log("im innn");
            res.status(403).json({ message: "No Token Found!!" });
            return
        }
    
        const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

        if (!secret) {
            res.status(403).json({ message: "access token not found!!" });
            return
        }
    
        const decoded = jwt.verify(token, secret);
    
        if (!(typeof decoded === "object")) {
            res.status(400).json({ message: "No object found!" });
            return;
        }
    
        const user = await client.user.findFirst({
            where: {
                id: decoded.id
            }
        });
    
        if (!user) {
            res.status(403).json({ message: "User not found! Invalid id" });
            return;
        }
    
        req.id = user.id;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

