import  client  from "@repo/db/client";
import { addReviewSchema, updateReviewSchema } from "@repo/types/types";
import dotenv from "dotenv";
import { Router } from "express";
import { verifyJwt } from "../../controlleres/userController.js";
export const reviewRouter: Router = Router();

reviewRouter.post("/", verifyJwt, async (req, res) => {
    console.log("im here");
    const parsedData = addReviewSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log("validation,", JSON.stringify(parsedData.error))
        res.status(400).json({ message: "validation failed...." })
        return
    }

    const newReview = await client.review.create({
        data: {
            movieId: parsedData.data.movieId,
            userId: req.id,
            review: parsedData.data.review,
            rating: parsedData.data.rating
        }
    })

    res.status(200).json({ newReview });
})

reviewRouter.get("/movies/:movieId", async (req, res) => {
    const movieId = req.params.movieId;

    if (!movieId) {
        res.status(400).json({ message: "no movie id found!!" });
        return;
    }

    const reviews = await client.review.findMany({
        where: { movieId }
    })

    if (reviews.length < 1) {
        res.status(400).json({ message: "no reviews found!!" });
        return;
    }

    res.status(200).json({ reviews });
})

reviewRouter.get("/:reviewId", async (req, res) => {
 
    const reviewId = req.params.reviewId;

    if (!reviewId) {
        res.status(400).json({ message: "no movie id found!!" });
        return;
    }

    const review = await client.review.findFirst({
        where: { id: reviewId }
    })

    if (!review) {
        res.status(400).json({ message: "no review found!!" });
        return;
    }

    res.status(200).json({ review });
})

reviewRouter.put("/:id", verifyJwt , async (req, res) => {
    
    const reviewId = req.params.id;
    const parsedData = updateReviewSchema.safeParse(req.body);

    if (!reviewId) {
        res.status(400).json({ message: "no id found!!" });
        return;
    }

    if (!parsedData.success) {
        res.status(400).json({ message: "validation failed...." })
        return
    }

    await client.review.update({
        where: {
            id: reviewId
        },
        data: {
            review: parsedData.data.review,
            rating: parsedData.data.rating
        }
    })

    res.status(200).json({ message: "review updated successfully!!" });
})

reviewRouter.delete("/:id", verifyJwt, async (req, res) => {
    const reviewId = req.params.id;

    if (!reviewId) {
        res.status(400).json({ message: "no id found!!" });
        return;
    }

    await client.review.delete({
        where: {
            id: reviewId
        }
    })

    res.status(200).json({ message: "review deleted successfully!!" });
})

