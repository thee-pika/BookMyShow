import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.cookies.access_token) {
            res.status(403).json({ message: "Not Authenticated!!" });
            return
        }
    
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}