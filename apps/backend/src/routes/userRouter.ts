import express from "express";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import { signinSchema, signUpUserSchema } from "@repo/types/types"
import dotenv from "dotenv"
import { JWT_PASSWORD } from "../config";
const router = express();
dotenv.config();

router.post("/signup", async (req, res) => {
    const parsedData = signUpUserSchema.safeParse(req.body);

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
        res.status(403).json({ message: "Username Exists!!" });
        return
    }

    const user = await client.user.create({
        data: {
            username: parsedData.data.username,
            password: parsedData.data.password
        }
    })

    res.status(200).json({ message: "User created successfully" });
})

router.post("/signin", async (req, res) => {
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
    const JWT_SECRET = process.env.JWT_PASSWORD || JWT_PASSWORD;
    const token = jwt.sign(user.id, JWT_SECRET)
    res.status(200).json({ token });
})