import z from "zod";

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

export const signinSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
})

export const createMovieSchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    adminId: z.string(),
})

export const updateMovieSchema = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string(),
})

export const createTicketSchema = z.object({
    ticketType: z.enum(["ordinary" , "premiere"]),
    price: z.number(),
    movieId: z.string(),
    userId: z.string()
})

export const createPaymentSchema = z.object({
    movieId: z.string(),
    userId: z.string(),
    paymentType: z.enum([ "success","failed","pending"])
})