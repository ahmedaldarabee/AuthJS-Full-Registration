import type { NextAuthConfig } from "next-auth"
import * as bcrypt from "bcryptjs"
import { loginSchemaValidation } from "./utils/Validations"
import { prisma } from "@/prisma/client"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Notice this is only an object, not a full Auth.js instance
export default {
   providers: [
      Credentials({
        async authorize(data){
          
          const validation = loginSchemaValidation.safeParse(data);
  
          if(validation.success){
            const {email, password} = validation.data;
            const user = await prisma.user.findUnique({where: {email}});
            
            // avoid login user if doesn't add own password by credential way, where user can't enter password if needed to use any one of providers like github of google or ...          
            if(!user || !user.password){
              return null; 
            }
  
            const isMatchedPassword = await bcrypt.compare(password,user.password);
            
            if(isMatchedPassword){
              return user; // here allow user to be complete SignIn process of login and we must to use it in auth.action of login !
            }
          }
          return null;
        }
      }),
      GitHub({
        clientId:process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET,
      }),
      Google({
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
} satisfies NextAuthConfig