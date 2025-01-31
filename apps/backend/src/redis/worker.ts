import Redis, { RedisClientType } from "redis";
import { v4 as uuidv4 } from "uuid";
import createOrder from "../controlleres/createOrder.js";
import { io } from "../socket/socket.js";
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log(`user is connected to ${socket.id}`);

  socket.on("register", (userId: string) => {
    userSockets.set(userId, socket.id);
    console.log(`user is connected to ${userId}, to the socket ${socket.id}`);
  })
  socket.on("disconnect", () => {
    userSockets.forEach((userId, id) => {
      if (socket.id === id) {
        userSockets.delete(userId);
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

export const addToQueue = async (queueName: string, userId: string) => {
  try {

  } catch (error) {
    console.log("Error:", error);
  }
}

export const processQueue = async (queueName: string) => {
  console.log("process queue", queueName);
  const userData = await redisClient.lPop(queueName);

  if (!userData) {
    return
  }

  const bookingData = await JSON.parse(userData);
  const userSocket = userSockets.get(bookingData.userId);
  console.log("booking data", bookingData);

  console.log("bookingData.userId:", bookingData.userId);
  console.log("Mapped socket id:", userSockets.get(bookingData.userId));

  const options = {
    amount: bookingData.amount,
    currency: "INR",
    receipt: "Payment for you tickets",
    payment_capture: 1
  }

  const orderDetails = await createOrder({ options });
  console.log("orderDetails", orderDetails);
  io.to(userSocket).emit("test_event", { message: "Test message" });

  if (orderDetails) {
    const { order_id,currency,amount,keyId} = orderDetails;
    console.log(`Emitting booking_update to socketId: ${userSocket}`);
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

export const generatePaymentLink = async (movieId: string, userId: string) => {

  const sessionId = uuidv4();

  await redisClient.set(`session:${sessionId}`, JSON.stringify({
    movieId: movieId,
    userId: userId,
    status: "pending",
    expiresAt: Date.now() + 3 * 60 * 1000
  })
  )

  const paymentLink = `https://razorpay.com/pay?sessionId=${sessionId}`;
  return paymentLink;
}

export { redisClient };