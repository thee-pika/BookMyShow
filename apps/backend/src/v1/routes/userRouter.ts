import express from "express";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import { signinSchema, signUpUserSchema } from "@repo/types/types"
import dotenv from "dotenv"
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../../config.js";
import { Router } from "express";
import bcrypt from "bcryptjs"
export const userRouter: Router = Router();
dotenv.config();

userRouter.post("/signup", async (req, res) => {

    const parsedData = signUpUserSchema.safeParse(req.body);

    try {
        if (!parsedData.success) {
            res.status(400).json({ message: "validation Failed!!" });
            return
        }

        const username_Exists = await client.user.findFirst({
            where: {
                username: parsedData.data.username
            }
        })

        if (username_Exists) {
            res.status(400).json({ message: "Username Exists!!" });
            return
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parsedData.data.password, salt)
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword
            }
        })

        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

userRouter.post("/signin", async (req, res) => {
    const parsedData = signinSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "validation Failed!!" });
        return
    }

    const user = await client.user.findFirst({
        where: {
            username: parsedData.data.username
        }
    })

    if (!user) {
        res.status(403).json({ message: "Invalid Credentials!!" });
        return
    }

    const passwdMatch = await bcrypt.compare(parsedData.data.password, user.password);

    if(!passwdMatch) {
        res.status(403).json({ message: "Invalid Credentials!!" });
        return
    }
    
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || JWT_ACCESS_TOKEN_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || JWT_REFRESH_TOKEN_SECRET;

    const access_token = jwt.sign(user.id, JWT_ACCESS_SECRET, { expiresIn: '1m' })
    const refresh_token = jwt.sign(user.id, JWT_REFRESH_SECRET, { expiresIn: '5m' })

    res.cookie("access_token",access_token, {maxAge: 60000});
    res.cookie("refresh_token", refresh_token, {maxAge:300000, httpOnly: true, secure: true, sameSite: 'strict'});

    res.status(200).json({ message: "Login sucessfully" });
})

