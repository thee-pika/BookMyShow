import express, { Application } from "express";
const app: Application = express();

import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow requests from all origins
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
});

export { io, httpServer, app };
