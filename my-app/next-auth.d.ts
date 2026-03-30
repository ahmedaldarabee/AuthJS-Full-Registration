// Global Type Changes

import NextAuth, { type DefaultSession } from "next-auth";
import { Role } from "@/prisma/client" // That be role that declared in prisma schema !

// here, we extend User model that be from prisma schema about Auth JS where we ensure adding this new column type [ Role ] to be used in auth.ts file
declare module "next-auth" {
    interface Session {
        // this user that exist on session data
        user: DefaultSession["user"] & { 
            role: Role,
            username: string,
            isTwoStepEnabled: boolean
        }
    }
}