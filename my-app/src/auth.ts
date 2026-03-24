import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/client"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter:PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
 ...authConfig,
})