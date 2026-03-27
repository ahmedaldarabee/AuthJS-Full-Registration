import { prisma } from "@/prisma/client"
import { randomUUID } from "node:crypto"

export const generateVerificationToken = async (email: string) => {
    const verificationTokenModel = await prisma.verificationToken.findFirst({where:{email}});
    
    // to delete last verification token and build new verification token !
    if(verificationTokenModel){
        await prisma.verificationToken.delete({where:{ id:verificationTokenModel.id }})
    }

    const newVerificationToken = await prisma.verificationToken.create({
        data: {
            token: randomUUID(),
            expire: new Date(new Date().getTime() + 3600 * 1000 * 2), // [ 3600 * 1000 ] = 1 Hour where * 2 that be 2 Hour to expire this token!
            email   
        }
    })

    return newVerificationToken;
}

export const generateForgetPasswordToken = async (email: string) => {
    const forgetPasswordTokenModel = await prisma.forgetPasswordToken.findFirst({where:{email}});
    
    if(forgetPasswordTokenModel){
        await prisma.forgetPasswordToken.delete({where:{ id:forgetPasswordTokenModel.id }})
    }

    const newForgetPasswordTokenToken = await prisma.forgetPasswordToken.create({
        data: {
            token: randomUUID(),
            expire: new Date(new Date().getTime() + 3600 * 1000 * 2),
            email   
        }
    })

    return newForgetPasswordTokenToken;
}