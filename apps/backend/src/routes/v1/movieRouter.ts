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
     
        res.status(500).json({ message: "Failed to upload image", error });
    }
})

movieRouter.get("/", async (req, res) => {
    const movies = await client.movie.findMany({});

    if (!movies) {
        res.json({ message: "no movies found!!" })
    }

    res.status(200).json({
        movies
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

    if (upcomingMovies.length < 1) {
        res.status(200).json({ message: "no upcoming movies found!!",upcomingMovies});
        return;
    }

    res.status(200).json({ upcomingMovies });
})

movieRouter.get("/streamed", async (req, res) => {
 
    const currentTime = new Date().toISOString();

    const streamedMovies = await client.movie.findMany({
        where: {
            startTime: {
                lt: currentTime
            }
        }
    })

    if (streamedMovies.length < 1) {
        res.status(400).json({ message: "no upcoming movies found!!" });
        return;
    }

    res.status(200).json({ streamedMovies });
})

movieRouter.get("/streaming", async (req, res) => {
 
    const lowerBound = new Date().toISOString();
    
    const upperBound = new Date(Date.now() + 7*24*60*60*1000).toISOString();
    
    const streamingMovies = await client.movie.findMany({
        where: {
            startTime: {
                gte: lowerBound,
                lte: upperBound
            }
        }
    })

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

    const pendingSeatNo = pendingSeats.map((seat:any) => seat.seatNo)
    const seatNos = seats.map((seat:any) => seat.seatNo)

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
 
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })
    res.status(200).json({ movie });
})

movieRouter.get("/:id/similar", async (req, res) => {
    
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: { id: movieId }
    })

    if (!movie) {
     
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
