import { NextResponse } from "next/server";

export async function GET(request){
    const cookies=request.cookies.get('token')?.value
    console.log(cookies);

    return NextResponse.json({cookies})

}