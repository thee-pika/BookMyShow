import z, { string } from "zod";

export const signUpUserSchema = z.object(
    {
        username: z.string(),
        password: z.string().min(6),
    }
)

export const signupAdminSchema = z.object(
    {
        username: z.string(),
        password: z.string().min(6),
        role: z.string()
    }
)

export const addReviewSchema = z.object({
    movieId: z.string(),
    review: z.string(),
    rating: z.number()
})

export const updateReviewSchema = z.object({
    review: z.string(),
    rating: z.number()
})

export const signinSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
})

export const createMovieSchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    totalSeats: z.number(),
    cinemahall: z.string(),
    seatPrice: z.number(),
    startTime: z.string(),
    banner: z.string(),
    year: z.number(),
    genre: z.enum(["Action", "Thriller", "Horror"]),
    language: z.enum(["Telugu","Hindi","English" ,"Tamil", "Malayalam"]),
    trailerId: z.string()
})

export const createBookingSchema = z.object({
    userId: z.string(),
    movieId: z.string(),
    seats: z.number(),
    paymentId: z.string(),
    totalPrice: z.number()
})

export const addToQueueSchema = z.object({
    queueName: z.string(),
})

export const createSeatSchema = z.object({
    userId: z.string(),
    movieId: z.string(),
    seatNo: z.number(),
    seatType: z.enum(["General", "Vip"]),
    booked: z.boolean(),
    price: z.number()
})

export const updateMovieSchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    totalSeats: z.number(),
    cinemahall: z.string(),
    seatPrice: z.number(),
    startTime: z.string(),
    banner: z.string(),
    year: z.number(),
    genre: z.enum(["Action", "Thriller", "Horror"]),
    language: z.enum(["Telugu","Hindi","English" ,"Tamil", "Malayalam"]),
    trailerId: z.string()
})

export const createPaymentSchema = z.object({
    movieId: z.string(),
    userId: z.string(),
    paymentType: z.enum(["success", "failed", "pending"])
})