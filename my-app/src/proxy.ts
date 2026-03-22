import { auth as proxy } from "@/auth"
import { NextRequest } from "next/server"

export default proxy((request: NextRequest) => {
    console.log(`middleware working now for thess paths ${request.nextUrl.pathname}`)
})
// the last middleware handler it will working for this matcher paths: [ '/login', ]
export const config = {
    matcher: ["/login","/register"]
}