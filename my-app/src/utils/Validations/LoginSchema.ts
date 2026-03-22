import z from "zod";

export const loginSchemaValidation = z.object({
    email: z.string().email({message:"enter correct email address"}),
    password: z.string().min(6, {message:"password must be at least 6 characters!"})
})

// extract the types of loginSchemaValidation
export type loginSchemaType = z.infer<typeof loginSchemaValidation>