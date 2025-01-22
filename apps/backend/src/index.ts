import express from "express";
import {userRouter } from "./v1/routes/userRouter.js";
import { movieRouter } from "./v1/routes/movieRouter.js";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/v1/auth",userRouter)
app.use("/api/v1/movie",movieRouter)
app.listen(PORT, () => {
    console.log(`app is listening to the ${PORT}`)
})
