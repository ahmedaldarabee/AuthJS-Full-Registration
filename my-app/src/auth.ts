import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

// for testing just
import Facebook from "next-auth/providers/facebook"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Github,Google,Facebook],
})