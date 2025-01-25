import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { client } from "@repo/db/client";
dotenv.config();

export const getRefreshedAccessToken = async (req: Request, res: Response) => {
    const userrefreshToken = req.body.refresh_token || req.cookies.refresh_token;

    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    if (!secret) {
        res.status(403).json({ message: "access token not found!!" });
        return
    }

    const decoded = jwt.verify(userrefreshToken, secret);
    if (!(typeof decoded === "object" && "id" in decoded)) {
        res.status(403).json({ message: "Not a val;oid object or id not exist" });
        return
    }
    const user = await client.user.findFirst({
        where: {
            id: decoded.id
        }
    })

    if (!user) {
        res.status(403).json({ message: "access token not found!!" });
        return
    }

    if (user.token !== userrefreshToken) {
        res.status(403).json({ message: "Invalid refresh token" });
        return
    }

    const { access_token, refresh_token } = await getAccessAndRefreshToken(user.id, "user");

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    res.status(200).json({ message: "Login sucessfully", access_token, refresh_token });
    return
}

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers["authorization"]?.split(" ")[1] || req.cookies?.access_token;

    if (!token) {
        console.log("im innn");
        res.status(403).json({ message: "No Token Found!!" });
        return
    }
    console.log('Token:', token);

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

    const user = await client.admin.findFirst({
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
}

export const getAccessAndRefreshToken = async (userId: string, dbName: string) => {

    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

    if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error("Token secrets are not defined!");
    }

    const access_token = jwt.sign({ id: userId }, JWT_ACCESS_SECRET, { expiresIn: '5m' })
    const refresh_token = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '1h' })
    if (dbName == "user") {
        await client.user.update({
            where: {
                id: userId
            },
            data: {
                token: refresh_token
            }
        })
        return { access_token, refresh_token };
    }
    const updated_user = await client.admin.update({
        where: {
            id: userId
        },
        data: {
            token: refresh_token
        }
    })
    return { access_token, refresh_token, updated_user };

}

declare global {
    namespace Express {
        interface Request {
            id: string
        }
    }
}