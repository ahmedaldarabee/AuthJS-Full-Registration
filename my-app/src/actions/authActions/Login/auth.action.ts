"use server"

import { signIn, signOut } from "@/auth";
import { prisma } from "@/prisma/client";
import { sendTwoStepTokenCode, sendVerificationEmail } from "@/utils/Email/mail";
import { generateTwoStepToken, generateVerificationToken } from "@/utils/generateToken";
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

    const {email, password,code} = result.data;
    
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
        
        // here we want to code to user email

        if(user.email && user.isTwoStepEnabled){
            // if user received the code, good, else generate the code
            if(code){

                const twoStepTokenFromDB = await prisma.twoStepToken.findFirst({where: { email: user.email }});
                const isExpired = new Date(twoStepTokenFromDB?.expire!) < new Date();

                if(!twoStepTokenFromDB || isExpired){
                    return { success:false, message: "Invalid Token" }
                }

                if(twoStepTokenFromDB.token !== code){
                    return { success:false, message: "Invalid Code" }
                }

                // if entered code and token are corrected, now we will enable user to login

                await prisma.twoStepToken.delete({
                    where: { 
                        id:twoStepTokenFromDB.id
                    }
                });

                const twoStepConfirmation = await prisma.twoStepConfirmation.findUnique({
                    where: {
                        userId: user.id
                    }
                });

                if(twoStepConfirmation){
                    await prisma?.twoStepConfirmation?.delete({where:{id: twoStepConfirmation.id}});
                }
                
                await prisma.twoStepConfirmation.create({
                    data: {
                        userId: user.id
                    }
                })

            }else{
                const twoStepCode = await generateTwoStepToken(user.email);
                 await sendTwoStepTokenCode(user.email,twoStepCode.token); // token that be code
                return { success:true,message:"Confirmation code is sent into your email", twoStep:true }
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