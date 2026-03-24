import type { NextAuthConfig } from "next-auth"
import * as bcrypt from "bcryptjs"
import { loginSchemaValidation } from "./utils/Validations"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export default {
   trustHost: true,
   providers: [
      Credentials({
        async authorize(data){
          const { prisma } = await import("@/prisma/client");
          
          const validation = loginSchemaValidation.safeParse(data);
  
          if(validation.success){
            const {email, password} = validation.data;
            const user = await prisma.user.findUnique({where: {email}});
            
            if(!user || !user.password){
              return null; 
            }
  
            const isMatchedPassword = await bcrypt.compare(password,user.password);
            
            if(isMatchedPassword){
              return user; 
            }
          }
          return null;
        }
      }),
      GitHub({}),
      Google({}),
    ],
} satisfies NextAuthConfig