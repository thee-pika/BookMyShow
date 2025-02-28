import express from "express";
import { app,httpServer } from "./socket/socket.js";
import { userRouter } from "./routes/v1/userRouter.js";
import { movieRouter } from "./routes/v1/movieRouter.js";
import { adminRouter } from "./routes/v1/adminRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { paymentRouter } from "./routes/v1/paymentRouter.js";
import "./jobs/paymentCleanupJob.js";
import { reviewRouter } from "./routes/v1/reviewRouter.js";
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use("/api/v1/auth", userRouter)
app.use("/api/v1/auth/admin", adminRouter)
app.use("/api/v1/movie", movieRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/review", reviewRouter)

app.get("/", (req,res) => {
    res.send("App is running");
})

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});