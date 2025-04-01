
import jwt from "jsonwebtoken";
import  client  from "@repo/db/client";
import { signinSchema, signupAdminSchema } from "@repo/types/types"
import dotenv from "dotenv"
import { Router } from "express";
import bcrypt from "bcryptjs"
import { getAccessAndRefreshToken, verifyJwt } from "../../controlleres/userController.js";

export const adminRouter: Router = Router();
dotenv.config();

adminRouter.post("/signup", async (req, res) => {

    const parsedData = signupAdminSchema.safeParse(req.body);

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
                password: hashedPassword,
                role: parsedData.data.role
            }
        })
     
        res.status(200).json({ userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

adminRouter.post("/signin", async (req, res) => {
    
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

    if (!passwdMatch) {
        res.status(403).json({ message: "Invalid Credentials!!" });
        return
    }

    const { access_token, refresh_token, updated_user } = await getAccessAndRefreshToken(user.id);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "production" ? "none" as "none": "lax" as "lax"
    };

    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    res.status(200).json({ message: "Login sucessfully", user: updated_user, access_token, refresh_token });
    return

})

adminRouter.get("/logout", verifyJwt, async (req, res) => {
    await client.user.update({
        where: {
            id: req.id
        },
        data: {
            token: undefined
        }
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .clearCookie("access_token", cookieOptions)
        .clearCookie("refresh_token", cookieOptions)
        .json({
            message: "User logged out successfullly!!"
        });
})