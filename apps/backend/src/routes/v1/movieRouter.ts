import { createMovieSchema, updateMovieSchema } from "@repo/types/types";
import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares/AuthMiddleware.js";
import { client } from "@repo/db/client";
import { verifyJwt } from "../../controlleres/userController.js";
import { adminMiddleWare } from "../../middlewares/admin.js";


import dotenv from "dotenv";
import express from "express";
dotenv.config();

export const movieRouter: Router = Router();
movieRouter.use(express.json());

movieRouter.post("/", verifyJwt, async (req, res) => {
    try {

        const parsedData = await createMovieSchema.safeParse(req.body);

        if (!parsedData.success) {
            console.log(JSON.stringify(parsedData.error))
            res.status(400).json({ message: "validation Failed!!" });
            return
        }

        const newMovie = await client.movie.create({
            data: {
                title: parsedData.data.title,
                description: parsedData.data.description,
                imageUrl: parsedData.data.imageUrl,
                userId: req.id,
                totalSeats: parsedData.data.totalSeats,
                cinemahall: parsedData.data.cinemahall,
                startTime: parsedData.data.startTime,
                seatPrice: parsedData.data.seatPrice,
                banner: parsedData.data.banner,
                year: parsedData.data.year,
                genre: parsedData.data.genre,
                language: parsedData.data.language,
                trailerId: parsedData.data.trailerId
            }
        })

        res.status(200).json({ movieId: newMovie });

    } catch (error) {
        console.log("err", error)
        res.status(500).json({ message: "Failed to upload image", error });
    }
})

movieRouter.get("/", async (req, res) => {
    const pageNo = req.query.page as string;
    const limitNo = req.query.limit as string;

    const limit = parseInt(limitNo!) || 6;
    const page = parseInt(pageNo) || 1; 

    const skip = (page - 1) * limit;

    const movies = await client.movie.findMany({
        skip,
        take:limit
    })

    if (!movies) {
        res.json({ message: "no movies found!!" })
    }
   
    res.status(200).json({
        movies
    })
})

movieRouter.get("/:id", async (req, res) => {
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })
    res.status(200).json({ movie });
})

movieRouter.put("/:id", verifyJwt, adminMiddleWare, async (req, res) => {
    console.log("im editing a movie put request");
    const movieId = req.params.id;

    const parsedData = updateMovieSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({ message: "validation Failed!!" });
        return
    }

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })

    if (!movie) {
        res.status(400).json({ message: "Invalid Id" });
        return
    }

    await client.movie.update({
        where: {
            id: movieId
        },
        data: {
            title: parsedData.data.title,
            description: parsedData.data.description,
            imageUrl: parsedData.data.imageUrl
        }
    })

    res.status(200).json({ message: "movie data updated successfully!!" });
})

movieRouter.delete("/:id", verifyJwt, adminMiddleWare, async (req, res) => {
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })

    if (!movie) {
        res.status(400).json({ message: "Invalid Id" });
        return
    }

    await client.movie.delete({
        where: {
            id: movieId
        }
    })

    res.status(200).json({ message: "movie deleted successfully!!" });
})