import Redis, { RedisClientType } from "redis";
import { v4 as uuidv4 } from "uuid";
import createOrder from "../controlleres/createOrder.js";
import { io } from "../socket/socket.js";
import { client } from "@repo/db/client";
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log(`user is connected to ${socket.id}`);

  socket.on("register", (movieId: string) => {
    userSockets.set(movieId, socket.id);
    console.log(`user is connected to ${movieId}, to the socket ${socket.id}`);
  })
  socket.on("disconnect", () => {
    userSockets.forEach((movieId, id) => {
      if (socket.id === id) {
        userSockets.delete(movieId);
      }
    })
  })
})

const redisClient: RedisClientType = Redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD,
});

await redisClient.connect();

export const processQueue = async (queueName: string, seats: number[]) => {

  const userData = await redisClient.lPop(queueName);

  if (!userData) {
    return { success: false }
  }

  const bookingData = await JSON.parse(userData);
  const movieId = bookingData.movieId;
  const userId = bookingData.userId;
  const userSocket = userSockets.get(movieId);

  const options = {
    amount: bookingData.amount,
    currency: "INR",
    receipt: "Payment for you tickets",
    payment_capture: 1
  }

  const orderDetails = await createOrder({ options });

  if (orderDetails) {
    const { order_id, currency, amount, keyId } = orderDetails;

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await client.seat.createMany({
      data: seats.map((seatNo) => ({
        seatNo,
        orderId: order_id,
        userId,
        status: "pending",
        movieId: queueName
      }))
    })

    redisClient.set(`session:${order_id}`, JSON.stringify(expiresAt, userId));

    io.to(userSocket).emit("booking_update", {
      orderId: order_id,
      currency,
      amount,
      keyId
    })

    return { success: true }
  }
  return { error: true }
}

export { redisClient };