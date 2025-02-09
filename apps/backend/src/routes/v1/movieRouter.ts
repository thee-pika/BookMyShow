import { createMovieSchema, updateMovieSchema } from "@repo/types/types";
import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares/AuthMiddleware.js";
import  client  from "@repo/db/client";
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
    const page = parseInt(pageNo) || 1;

    const totalMovies = await client.movie.count();
    const limit = parseInt(limitNo!) || 1;
    const totalPages = Math.ceil(totalMovies / limit);
    const skip = (page - 1) * limit;

    const movies = await client.movie.findMany({
        skip,
        take: limit
    })

    if (!movies) {
        res.json({ message: "no movies found!!" })
    }

    res.status(200).json({
        movies,
        totalPages
    })
})

movieRouter.get("/upcoming", async (req, res) => {
 
    const currentTime = new Date().toISOString();

    const upcomingMovies = await client.movie.findMany({
        where: {
            startTime: {
                gt: currentTime
            }
        }
    })

    console.log("upcoming,", upcomingMovies);
    if (upcomingMovies.length < 1) {
        res.status(400).json({ message: "no upcoming movies found!!" });
        return;
    }

    res.status(200).json({ upcomingMovies });
})

movieRouter.get("/streaming", async (req, res) => {
 
    const lowerBound = new Date().toISOString();
    console.log("lowerBound time", lowerBound);
    const upperBound = new Date(Date.now() + 7*24*60*60*1000).toISOString();
    console.log("upperBound time", upperBound);
    const streamingMovies = await client.movie.findMany({
        where: {
            startTime: {
                gte: lowerBound,
                lte: upperBound
            }
        }
    })

    console.log("upcoming,", streamingMovies);
    if (streamingMovies.length < 1) {
        res.status(400).json({ message: "no upcoming movies found!!" });
        return;
    }

    res.status(200).json({ streamingMovies });
})

movieRouter.get("/:id/seats", async (req, res) => {
    const movieId = req.params.id;

    const seats = await client.seat.findMany({
        where: {
            movieId,
            status: "booked"
        }
    })

    const pendingSeats = await client.seat.findMany({
        where: {
            movieId,
            status: "pending"
        }
    })

    const pendingSeatNo = pendingSeats.map((seat) => seat.seatNo)
    const seatNos = seats.map((seat) => seat.seatNo)

    if (seats === null) {
        res.status(200).json({
            seats: [],
            pendingSeats: []
        })
        return;
    }

    res.status(200).json({
        seats: seatNos,
        pendingSeats: pendingSeatNo
    })
})
movieRouter.get("/:id", async (req, res) => {
    console.log(" u cheated meee");
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })
    res.status(200).json({ movie });
})

movieRouter.get("/:id/similar", async (req, res) => {
    console.log("im innn getting movies section ........");
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: { id: movieId }
    })

    if (!movie) {
        console.log("are we here...");
        res.status(400).json({ message: "no movies found!!" });
        return;
    }

    const similarMovies = await client.movie.findMany({
        where: {
            id: { not: movieId },
            OR: [
                { genre: movie.genre },
                { language: movie.language },
                { year: movie.year }
            ]
        }
    });

    res.status(200).json({ similarMovies });
})

movieRouter.put("/:id", verifyJwt, adminMiddleWare, async (req, res) => {
    const movieId = req.params.id;

    const parsedData = updateMovieSchema.safeParse(req.body.movieData);

    if (!parsedData.success) {
        console.log("error", parsedData.error)
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
