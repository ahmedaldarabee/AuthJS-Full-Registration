import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/client" // for access models/tables that exist in database
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  events: {
    // this way [ link account ] because when user login/register by google/github the own email that be verified already, but when user try to add own data [ email and password ] by credentials in this way [ credentials ] here needed an another way for email verification that be normal two step verification by code that received in email of user 
    async linkAccount({user}) {
        await prisma.user.update({
          where:{id: user.id},
          data:{ emailVerified: new Date() }
        })
    }
  },
  callbacks: {
    // token: that be content user data and created by Auth JS for authentication and security process where once user register own account and that store it in cookie then you use can use it within the session

    // this session != Session Model in prisma schema, where this async session that be temp Object that used to store user data to  use it in frontend side just !
    
    async session({ session, token }) {

      // that be this object [ session ]: it will not store it in database 
      if (session.user && token.sub) {
        session.user.id = token.sub; 
        const user = await prisma.user.findUnique({where: {id: token.sub }});
        
        if(user){
          session.user.role = user.role
          session.user.username = user.username || "Anonymous";
          session.user.isTwoStepEnabled = user.isTwoStepEnabled || false;
        }
      }
      return session;
    },

    // layer for more security!
    async signIn({user,account}){
      
      if(account?.provider === "credentials") return true;

      const userFromDB = await prisma.user.findUnique({where: {id: user.id}})
      
      if(!userFromDB?.emailVerified){
        return false; // avoid enable user to login if own email doesn't verified!
      }

      if(userFromDB.isTwoStepEnabled){
          // Why we add next section:
          const twoStepConfirmationModel = await prisma.twoStepConfirmation.findUnique({where:{userId: user.id}});
          
          // What the next section mean:
          if(!twoStepConfirmationModel) return false;

          await prisma.twoStepConfirmation.delete({
            where: { id: twoStepConfirmationModel.id }
          });
      }

      

      return true;
    }
  },
  adapter:PrismaAdapter(prisma),
  session: {strategy: 'jwt'}, // jwt : that store user data
  secret: process.env.AUTH_SECRET,
 ...authConfig,
})