import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/client"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter:PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
  secret: process.env.AUTH_SECRET,
 ...authConfig,
})