import { createBookingSchema } from "@repo/types/types";
import { Router } from "express";
import { AuthMiddleWare } from "../../middlewares/AuthMiddleware.js";
import { client } from "@repo/db/client";


export const bookingRouter: Router = Router();

bookingRouter.post("/", AuthMiddleWare, async (req, res) => {
    try {
        const parsedData = createBookingSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(400).json({ message: "validation Failed!!" });
            return
        }
        
        const payment = await client.payments.findFirst({
            where: {
                userId: parsedData.data.userId,
                movieId: parsedData.data.movieId
            }
        })

        const booking = await client.$transaction([
            client.booking.create({
                data: {
                    movieId: parsedData.data.movieId,
                    userId: parsedData.data.userId,
                    seats: parsedData.data.seats,
                    paymentId: "",
                    totalPrice: parsedData.data.totalPrice
                }
            }),

            client.seat.create({
                data: {
                    userId: parsedData.data.userId,
                    movieId: parsedData.data.movieId,
                    booked: true,
                    seatNo: parsedData.data.seats,
                    seatType: "General",
                    price: parsedData.data.totalPrice
                }
            }),

        ])

        if (!booking) {
            res.status(400).json({ message: "Booking not created error occured!" });
            return
        }

        res.status(200).json({ message: "booking created" })
    } catch (error) {

        res.status(500).json({ message: "Internal error occured" });
    }
})

bookingRouter.get("/", async (req, res) => {
    try {
        const bookings = await client.booking.findMany();

        if (bookings && bookings.length > 0) {
            res.status(200).json({ message: "booking created", bookings });
            return;
        }
        res.status(400).json({ message: "no bookings created" });
    } catch (error) {
        res.status(500).json({ message: "Internal error occured" });
    }
})
