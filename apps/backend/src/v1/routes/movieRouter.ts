import { createMovieSchema,updateMovieSchema } from "@repo/types/types";
import { Router } from "express";
import { isAuthenticated } from "../../middlewares/AuthMiddleware.js";
import { client } from "@repo/db/client";

export const movieRouter: Router = Router();

movieRouter.post("/", isAuthenticated, async (req, res) => {
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
            adminId: parsedData.data.adminId
        }
    })

    res.status(200).json({ movieId: newMovie.id })
})

movieRouter.get("/", async (req, res) => {
    const movies = await client.movie.findMany();

    if (movies) {
        res.json({ message: "no movies found!!" })
    }

    res.json({
        movies: movies.map((movie) => {
            title: movie.title,
                description: movie.description,
                    imageUrl: movie.imageUrl,
                        adminId: movie.adminId,
                            id: movie.id
        })
    })
})

movieRouter.get("/:id", (req, res) => {
    const movieId = req.params.id;

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })

    res.status(200).json({ movie });
})

movieRouter.put("/:id", (req, res) => {
    const movieId = req.params.id;

    const parsedData = updateMovieSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(400).json({ message: "validation Failed!!" });
        return
    }

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })

    if(!movie) {
        res.status(400).json({ message: "Invalid Id" });
        return 
    }

    await client.movie.update({
        where:{
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

movieRouter.delete("/:id", (req,res) => {
    const movieId = req.params.id;

    const parsedData = updateMovieSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(400).json({ message: "validation Failed!!" });
        return
    }

    const movie = await client.movie.findFirst({
        where: {
            id: movieId
        }
    })

    if(!movie) {
        res.status(400).json({ message: "Invalid Id" });
        return 
    }

    await client.movie.delete({
        where:{
            id: movieId
        }
    })

    res.status(200).json({ message: "movie deleted successfully!!" });
})