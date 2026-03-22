"use server"

import { loginSchemaValidation, loginSchemaType } from "@/utils/Validations"

export const LoginAction = async ({email,password}: loginSchemaType) => {
    const result = loginSchemaValidation.safeParse({ email, password })

    if(!result.success){
        return {
            success:false, message: result.error.issues.map(issue => issue.message)
        }
    }

    console.log('login data: ',email,password);

    return {
        success: true, message:"login process successfully"
    }
}