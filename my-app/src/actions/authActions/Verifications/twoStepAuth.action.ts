"use server"

import { prisma } from "@/prisma/client"


export const toggleTwoStepAuthAction = async (userId: string, isEnabled: boolean) => {

    try {
        const user = await prisma.user.findUnique({
            where:{id: userId}
        })

        if(!user){
            return { success: false, message: "this user not found!" }
        }

        await prisma.user.update({
            where: {id: userId},
            data:{ isTwoStepEnabled:isEnabled}
        })

        return { success: true, message: "User now is secured!" }

    } catch (error) {
        console.log('error of two step authentication: ',error)
        return { success: false, message: "this user not found!" }
    }
} 