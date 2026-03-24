"use server"

import { signIn, signOut } from "@/auth";
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

        console.log('login error : ',error)
        throw error;
    }

    return {
        success: true, message:"login successfully"
    }
}

export const LogoutAction = async() => {
    await signOut();
}