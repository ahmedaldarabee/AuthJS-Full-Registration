import z from "zod";

export const loginSchemaValidation = z.object({
    email: z.string().email({message:"enter correct email address"}),
    password: z.string().min(6, {message:"password must be at least 6 characters!"})
})

export const forgetPasswordSchemaValidation = z.object({
    email: z.string().email({message:"enter correct email address"})
})

export const resetPasswordSchemaValidation = z.object({
    newPassword: z.string().min(6, {message:"password must be at least 6 characters!"})
})

// extract the types of loginSchemaValidation
export type loginSchemaType = z.infer<typeof loginSchemaValidation>
export type forgetSchemaType = z.infer<typeof forgetPasswordSchemaValidation>
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchemaValidation>