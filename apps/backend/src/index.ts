import express from "express";
import {userRouter } from "./routes/v1/userRouter.js";
import { movieRouter } from "./routes/v1/movieRouter.js";
import { adminRouter } from "./routes/v1/adminRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/auth",userRouter)
app.use("/api/v1/auth/admin",adminRouter)
app.use("/api/v1/movie",movieRouter)
app.listen(PORT, () => {
    console.log(`app is listening to the ${PORT}`)
})
