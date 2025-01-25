import { createMovieSchema, updateMovieSchema } from "@repo/types/types";
import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares/AuthMiddleware.js";
import { client } from "@repo/db/client";
import { verifyJwt } from "../../controlleres/userController.js";
import { adminMiddleWare } from "../../middlewares/admin.js";

export const movieRouter: Router = Router();

movieRouter.post("/", verifyJwt, adminMiddleWare, async (req, res) => {
    console.log("im innnnn");
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
    console.log("new movie", newMovie);
    res.status(200).json({ movieId: newMovie.id });
})

movieRouter.get("/", async (req, res) => {
    const movies = await client.movie.findMany();

    if (!movies) {
        res.json({ message: "no movies found!!" })
    }
    console.log("movies,", movies);
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