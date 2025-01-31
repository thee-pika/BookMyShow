import { Router } from "express";
import { client } from "@repo/db/client";
import { redisClient } from "../../redis/worker.js";
import { processQueue } from "../../redis/worker.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { verifyJwt } from "../../controlleres/userController.js";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

interface Session {
    userId: string,
    movieId: string,
    status: string,
    expiresAt: number
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const paymentRouter: Router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})

paymentRouter.post("/order", async (req, res) => {
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt,
        payment_capture: 1
    }

    try {
        const response = await razorpay.orders.create(options);
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            keyId: process.env.RAZORPAY_KEY_ID!
        })
    } catch (error) {
        console.log("error", error);
    }
})

paymentRouter.post("/book",verifyJwt, async (req, res) => {
    try {
        const userId = req.id;
        const movieId = req.body.queueName;
        const amount = req.body.amount;
        console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        console.log("req", req.body);
        await redisClient.rPush(movieId, JSON.stringify({userId:movieId,amount}));

        const movie = await client.movie.findFirst({
            where: {
                id: movieId
            }
        })

        if (!movie) {
            res.status(400).json({ message: "no movie found!!" });
            return;
        }

        await processQueue(movieId);

        res.status(200).json({ message: "order id created successfully"});
    
    } catch (error) {
        res.status(500).send("Error sending payment link.");
    }
});

paymentRouter.post("/verification", async (req, res) => {
    const SECRET = "kKmvVDMqrXZ4@2B";
    console.log("rrrrrrrrrrrrrrrrrrrr");
    console.log("req.body", req.body);

    const data = crypto.createHmac('sha256', SECRET)

    data.update(JSON.stringify(req.body))

    const digest = data.digest('hex');
    console.log("digest", digest);

    if (digest === req.headers['x-razorpay-signature']) {

        res.json({
            status: 'ok'
        })

    } else {

        res.status(400).send('Invalid signature');

    }



    // const { event, payload, paymentStatus } = req.body;
    // if (event === "payment.paid") {
    //     const userId = payload.payment_link.reference_id;
    //     const sessionKey = `session:${userId}`;
    //     const sessionData = await redisClient.get(sessionKey);
    //     if (sessionData) {
    //         const session: Session = await JSON.parse(sessionData);
    //         if (paymentStatus && session.expiresAt > Date.now()) {

    //             session.status = "success";
    //             await redisClient.set(sessionKey, JSON.stringify(session));
    //             //      //    transactionId: userId
    //             await client.payments.create({
    //                 data: {
    //                     userId: session.userId,
    //                     movieId: session.movieId,
    //                     paymentType: "success"
    //                 }
    //             })

    //             console.log(`Payment successful for user ${userId}`);
    //         } else {
    //             console.log(`Payment failed or session expired for user ${userId}`);
    //         }
    //     }
    // }
})

const checkExpiredSessions = async () => {
    const sessionKeys = await redisClient.keys("session:*");
    for (const key in sessionKeys) {
        const sessionData = await redisClient.get(key);
        if (sessionData) {
            const session: Session = JSON.parse(sessionData);
            if (session.expiresAt < Date.now() && session.status === "pending") {
                await redisClient.del(key);
            }
        }
    }
}

  //     const paymentLink = await generatePaymentLink(movieId, userId)
        //     const userEmail = "mogilimounika97@gmail.com";

        //     const emailOptions = {
        //         from: process.env.EMAIL_ADDRESS,
        //         to: userEmail,
        //         subject: "Your payment Link for the movie",
        //         text: `Hello, 
  
        //   You are next in line to book tickets for the movie! 
        //   Please use the following link to complete your payment:
          
        //   ${paymentLink}
          
        //   The link will expire in 3 minutes. 
  
        //   Best regards,
        //   Movie Ticket Booking Team`
        //     }

        //     transporter.sendMail(emailOptions);