import { NextResponse } from "next/server"
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const authRoutes = ["/login","/register"];
const protectedRoutes = ["/profile"];

const {auth: proxy} = NextAuth(authConfig);

export default proxy((request) => {
    const { nextUrl } = request;
    const currentPath = nextUrl.pathname;

    // avoid access login and register pages

    const isUserLoggedIn : boolean = Boolean(request.auth);

    if(isUserLoggedIn && authRoutes.includes(currentPath)){
        return NextResponse.redirect(new URL("/profile",nextUrl));
    }
    
    if(!isUserLoggedIn && protectedRoutes.includes(currentPath)){
        return NextResponse.redirect(new URL("/login",nextUrl));
    }
})


// the last middleware handler it will working for next matcher paths
export const config = {
    matcher: ["/login","/register","/profile"]
}