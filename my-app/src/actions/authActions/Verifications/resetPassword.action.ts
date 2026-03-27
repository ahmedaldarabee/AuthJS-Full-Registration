"use server"

import { resetPasswordSchemaType, resetPasswordSchemaValidation } from "@/utils/Validations"
import { prisma } from "@/prisma/client"
import * as bcrypt from "bcryptjs";

export const resetPasswordAction = async(props: resetPasswordSchemaType, token: string) => {
    try {
        
        const Validations = resetPasswordSchemaValidation.safeParse(props);

        if(!Validations.success){
            return {success:false,message:"Enter corrected password"}
        }

        const {newPassword} = Validations.data;

        const resetPasswordToken = await prisma.forgetPasswordToken.findUnique({where: {token}});

        if(!resetPasswordToken){
            return {success:false,message:"your token isn't exist! "};
        }

        const isExpire =  new Date(resetPasswordToken.expire) < new Date();

        if(isExpire){
            return {success:false,message:"your token is expired!"};
        }

        const user = await prisma.user.findUnique({
            where: {
                email: resetPasswordToken.email
            }
        });

        if(!user){
            return {success:false,message:"This account isn't exist!"};
        }

        // after we do validation, now we can create new password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        // new user data 
        await prisma.user.update({
            where:{id: user.id},
            data:{
                password: hashedPassword
            }
        })

        // remove last token to get new token after this process

        await prisma.forgetPasswordToken.delete({
            where: {
                id: resetPasswordToken.id
            }
        })

        return {success:true,message:"reset password done!"}

    } catch (error) {
        return {success:false,message:"something went wrong"}
    }
}