import z from "zod";

export const registerSchemaValidation = z.object({
    username: z.string().min(4, {message:"username must be at least 4 characters!"}),
    email: z.string().email({message:"enter correct email address"}),
    password: z.string().min(6, {message:"password must be at least 6 characters!"})
})

export type registerSchemaType = z.infer<typeof registerSchemaValidation>