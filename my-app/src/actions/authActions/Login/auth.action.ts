"use server"

import { signIn, signOut } from "@/auth";
import { prisma } from "@/prisma/client";
import { sendVerificationEmail } from "@/utils/Email/mail";
import { generateVerificationToken } from "@/utils/generateToken";
import { loginSchemaValidation } from "@/utils/Validations"
import { AuthError } from "next-auth";
import z from "zod"

export const LoginAction = async (data: z.infer<typeof loginSchemaValidation>) => {
    const result = loginSchemaValidation.safeParse(data);

    if(!result.success){
        return {
            success:false, message: "Invalid Credentials"
        }
    }

    const {email, password} = result.data;

    
    try {
        const user = await prisma.user.findUnique({where: {email}});
    
        if(!user || !user.email || !user.password){
            return {
                success:false, message: "Invalid Credentials"
            }
        }
    
        if(!user.emailVerified){
            const verificationTokenInfo = await generateVerificationToken(email);
            // send email to user
            const mailResponse = await sendVerificationEmail(verificationTokenInfo.email,verificationTokenInfo.token);
            
            if (mailResponse.error) {
                console.log("Mail verification failed during login:", mailResponse.error);
                return { success: false, message: "Could not send verification email. Please try again later." };
            }

            return {
                success:true, message: "Please verify your email!"
            }
        }
        
        await signIn('credentials',{email,password, redirectTo:"/profile"});
    } catch (error) {
        
        // instanceof as we say if [ error ] object from [ AuthError ] class 
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return { success:false, message: "Invalid SignIn" }
                default:
                    return { success:false, message: "Something went wrong" }
            }
        }
        throw error;
    }

    return {
        success: true, message:"login successfully"
    }
}

export const LogoutAction = async() => {
    await signOut();
}