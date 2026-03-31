"use server"

import { prisma } from "@/prisma/client";
import { editProfileSchemaType, editProfileSchemaValidation } from "@/utils/Validations"


export const updateProfileAction = async (props:  editProfileSchemaType,userId: string) => {
    try {
        const validation = editProfileSchemaValidation.safeParse(props);
        if(!validation.success){
            return { success:false, message:"Invalid name" }
        }

        const {username} = validation.data;

        const user = await prisma.user.findUnique({
            where:{id: userId}
        })

        if(!user){
            return { success:false, message:"user not found!" }
        }

        await prisma.user.update({
            where: {id:userId },
            data:{username}
        })

        return { success:true, message:"update user name successfully" }

    } catch (error) {
        console.log('Error about update user: ',error);
        return { success:false, message:"something went wrong!" }
    }
}

export const getUserName = async (userId: string) => {

    try {
        const user = await prisma.user.findUnique({ where:{
            id: userId
        }});

        if(!user){
            return { success:false,message:"this user isn't exist! " }
        }

        return {success:true,message: user?.username}
    } catch (error) {
        return { success:false,message:"something went wrong!" }
    }
}