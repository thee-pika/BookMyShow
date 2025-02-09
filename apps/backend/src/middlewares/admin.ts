import  client  from "@repo/db/client";
import { NextFunction, Request, Response } from "express";

export const adminMiddleWare = async (req: Request, res: Response, next:NextFunction) => {
    console.log("imn nin adminnnnn");
    const userId = req.id;

    const admin = await client.user.findFirst({
        where: {
            id: userId,
            role: "admin"
        }
    });
   
    if (!admin) {
        res.status(403).json({ message: "Un authorized user" });
        return
    }

   next();
}

