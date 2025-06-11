import { IUserRepository } from "../repositories/IUserRepository";
import { RequestOtpDto } from "../dtos/User.dto";

export class RequestOtpUseCase{
    constructor(private readonly userRepository:IUserRepository){}
    async execute (requestData:RequestOtpDto):Promise<boolean>{
        const {email} = requestData;
        const user= await this.userRepository.requestOtp(email);
        if (!user) {
            throw new Error('Failed to send OTP. Please try again or contact support.');
        }
        return user !==null;
    }
}