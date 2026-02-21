import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/client";
import schema from "./schema";

export async function GET(request: NextRequest) {
    const users = await prisma.user.findMany(); 
    return NextResponse.json(users);
}

export async function POST(request: NextRequest){
    const bodyData = await request.json();
    const validation = schema.safeParse(bodyData);

    if(!validation.success){
        return NextResponse.json(validation.error,{
            status:400,
        })
    }
    
    const user = await prisma.user.create({
        data: {
            username: bodyData.name,
            email: bodyData.email,
        }
    })

    return NextResponse.json(user, { status: 201 })
}