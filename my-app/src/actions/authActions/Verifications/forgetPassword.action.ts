"use server"
import { forgetPasswordSchemaValidation, forgetSchemaType } from "@/utils/Validations"
import { prisma } from "@/prisma/client"
import { generateForgetPasswordToken } from "@/utils/generateToken";
import { sendPasswordReset } from "@/utils/Email/mail";

export const forgetPasswordAction = async (props: forgetSchemaType) => {
    try {
        const verification = forgetPasswordSchemaValidation.safeParse(props);
        
        if(!verification.success){
            return { success: false, message: "invalid email address" }
        }
    
        const {email} = verification.data;
    
        const user = await prisma.user.findUnique({where:{email}});
    
        if(!user){
            return { success: false, message: "user doesn't exist!" }
        }
    
        // if email that be correct and user also exist, here we will start implementing main feature from this action [ Forget-Password-Handling ]
    
        const resetEmail = await generateForgetPasswordToken(email);
        await sendPasswordReset(resetEmail.email,resetEmail.token);
        
        return { success: true, message: "reset password is sent, check your email" }

    } catch (error) {
        return { success: false, message: "something went wrong!" }
    }

}