"use server"

// server actions

import { prisma } from "@/prisma/client"
import { registerSchemaValidation } from "@/utils/Validations"
import z, { success } from "zod"
import * as bcrypt from 'bcryptjs' 
import { generateVerificationToken } from "@/utils/generateToken"
import { sendVerificationEmail } from "@/utils/Email/mail"

export const RegisterAction = async (data: z.infer<typeof registerSchemaValidation>) => {
    const validationResult = registerSchemaValidation.safeParse(data)

    if(!validationResult.success){ 
        return { success:false, message: "invalid credential"} 
    }

    const {username,email,password} = validationResult.data;

    // check if already exist
    let existingUser;
    try {
        existingUser = await prisma.user.findFirst({
            where: { email: email }
        });

    } catch (e: any) {
        console.log("Prisma check failed:", e);
        return { success: false, message: `Database check error of your email` };
    }

    if (existingUser) {
        return { success: false, message: "User already exists with this email!" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const verificationTokenInfo = await generateVerificationToken(email);
        // send email to user
        const mailResponse = await sendVerificationEmail(verificationTokenInfo.email,verificationTokenInfo.token);
    
        if (mailResponse.error) {
            console.log("Mail verification failed during registration:", mailResponse.error);
            return { success: false, message: "User created but could not send verification email. Please try to log in to resend the email." };
        }

    } catch (e: any) {
        console.log("Registration failed:", e);
        return { success: false, message: `Failed to create user` };
    }

    return {
        success: true, message: "Please verify your email!"
    }
}