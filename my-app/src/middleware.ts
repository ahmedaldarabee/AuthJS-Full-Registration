import { NextResponse } from "next/server"
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const authRoutes = ["/login","/register","/verify","/forget-password","/reset-password"];
const protectedRoutes = ["/profile","/profile/edit"];

const {auth: proxy} = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
});

export default proxy((request) => {
    const { nextUrl } = request;
    const currentPath = nextUrl.pathname;

    // avoid access login and register pages

    const isUserLoggedIn : boolean = Boolean(!!request.auth);

    if(isUserLoggedIn && authRoutes.includes(currentPath)){
        return NextResponse.redirect(new URL("/profile",nextUrl));
    }
    
    if(!isUserLoggedIn && protectedRoutes.includes(currentPath)){
        return NextResponse.redirect(new URL("/login",nextUrl));
    }

    return NextResponse.next();
})


// the last middleware handler it will working for next matcher paths
// export const config = {
//     matcher: ["/login","/register","/profile/:path/*","/verify","/forget-password","/reset-password"]
// }

export const config = {
    matcher: [
        "/login",
        "/register",
        "/profile",
        "/profile/:path*",
        "/verify",
        "/forget-password",
        "/reset-password"
    ]
}