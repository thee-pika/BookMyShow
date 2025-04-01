import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import  client  from "@repo/db/client";
dotenv.config();

export const getRefreshedAccessToken = async (refreshToken: string) => {
    const userrefreshToken = refreshToken;

    const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error(" secrets are not defined!");
    }

    const decoded = jwt.verify(userrefreshToken, secret);
    if (!(typeof decoded === "object" && "id" in decoded)) {
        throw new Error("Not a val;oid object or id not exist");

    }

    const user = await client.user.findFirst({
        where: {
            id: decoded.id
        }
    })

    if (!user) {
        throw new Error("access token not found!!");
    }

    if (user.token !== userrefreshToken) {
        throw new Error("Invalid refresh token");
    }

    const { access_token, refresh_token } = await getAccessAndRefreshToken(user.id);

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return { access_token, refresh_token };
}

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers["authorization"]?.split(" ")[1] || req.cookies?.access_token;

    if (!token) {
        res.status(403).json({ message: "No Token Found!!", token : req.cookies?.access_token });
        return
    }
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

    if (!secret) {
        res.status(403).json({ message: "access token not found!!" });
        return
    }

    try {
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

    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            
            const decoded = jwt.decode(token) as { id: string };
           

            const user = await client.user.findFirst({
                where: {
                    id: decoded.id
                }
            })

            const refreshToken = user?.token;
       
            const { access_token, refresh_token } = await getRefreshedAccessToken(refreshToken!);

            const cookieOptions = {
                httpOnly: true,
                secure: true
            }
            
            res.cookie("access_token", access_token, cookieOptions);
            res.cookie("refresh_token", refresh_token, cookieOptions);

            await client.user.update({
                where: {
                    id: decoded.id
                },
                data: {
                    token: refresh_token
                }
            })
            req.id = decoded.id!;
            next();
        }
    }
}

export const getAccessAndRefreshToken = async (userId: string) => {

    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

    if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error("Token secrets are not defined!");
    }

    const access_token = jwt.sign({ id: userId }, JWT_ACCESS_SECRET, { expiresIn: '10m' })
    const refresh_token = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '1h' })
   
    const updated_user = await client.user.update({
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