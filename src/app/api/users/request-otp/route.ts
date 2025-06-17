import { NextResponse } from "next/server";
import { PrismaUserRepository } from "@/core/repositories/IUserRepository";
import { RequestOtpUseCase } from "@/core/usecases/RequestOtp.usecase";
import { RequestOtpDto } from "@/core/dtos/User.dto";

const userRepo = new PrismaUserRepository();
const requestOtpUseCase= new RequestOtpUseCase(userRepo);

export async function POST(request:Request){
    try {
        const  body:RequestOtpDto = await request.json();
        if(!body.email){
            return NextResponse.json({message:"email is required "},{status:400});
        }
        const otpResponse=await requestOtpUseCase.execute(body);
        return NextResponse.json(otpResponse,{status:200})
    } catch (error) {
        console.error("error during request otp");
    }
}