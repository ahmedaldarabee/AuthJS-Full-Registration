"use server"
import { prisma } from "@/prisma/client";

export const verificationEmailAction = async (token: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({where: {token}});

        if(!verificationToken){
            return { success: false, message: "Invalid verification token" }
        }

        const isExpired = new Date(verificationToken.expire) < new Date();

        if(isExpired){
            return { success: false, message: "token expired" }
        }

        const user = await prisma.user.findUnique({
            where: {email: verificationToken.email}
        });

        if(!user){
            return { success: false, message: "user not found!" }
        }

        // if user exist ! 
        // update emailVerification to referring this user is verified
        await prisma.user.update({
            where: {id: user.id},
            data: {
                emailVerified: new Date()
            }
        });

        await prisma.verificationToken.delete({
            where: {id: verificationToken.id}
        })

        return { success: true, message: "email verified successfully" }

    } catch (error: any) {
        return { success: false, message: "Something went wrong during verification" }
    }
}