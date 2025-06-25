import prisma from "@/lib/prisma";
import { UserEntity } from "../entities/User.entity";
import { CreateUserDto,UpdateUserDto,userResponseDto ,LoginResponseDto,RequestOtpDto,VerifyOtpDto} from "../dtos/User.dto";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES =5; // otp valid for 5 minutes after five minutes it will expires



// configure nodemailer transporter for sending email otp
const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:587,
  secure:false,
  auth:{
    user:process.env.EMAIL_USER,  //your sending email address 
    pass:process.env.EMAIL_PASS, //your email password or app specific password
  },
});

export interface IUserRepository {
    findAll(): Promise<UserEntity[]>;
    findById(id:String):Promise<UserEntity |null>;
    create(userData:CreateUserDto):Promise<UserEntity>;
    update(id:String, data :Partial<UpdateUserDto>):Promise<UserEntity>;
    delete(id:String):Promise<void>
    findByEmail(email:String):Promise<UserEntity |null>;
    requestOtp(email:string):Promise<UserEntity |null>;
    verifyOtpAndLogin(email:string,otp:string):Promise<LoginResponseDto>;
}
export class PrismaUserRepository implements IUserRepository {
  private mapPrismaUserToUserEntity(prismaUser: any): UserEntity {
    return new UserEntity(
      prismaUser.id,
      prismaUser.firstName,
      prismaUser.lastName,
      prismaUser.email,
      prismaUser.password, // This is the HASHED password from the DB
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.isAdmin,
      prismaUser.phone || undefined,
      prismaUser.otp ||null,
      prismaUser.otpExpiresAt ||null
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const prismaUsers = await prisma.user.findMany();
    return prismaUsers.map(this.mapPrismaUserToUserEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });
    return prismaUser ? this.mapPrismaUserToUserEntity(prismaUser) : null;
  }

  async create(userData: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createdPrismaUser = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        isAdmin: userData.isAdmin ?? false,
      },
    });
    return this.mapPrismaUserToUserEntity(createdPrismaUser);
  }

  async update(id: string, updateData: Partial<UpdateUserDto>): Promise<UserEntity> {
    const dataToUpdate: any = { ...updateData };

    if (updateData.password) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedPrismaUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    return this.mapPrismaUserToUserEntity(updatedPrismaUser);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });
    return prismaUser ? this.mapPrismaUserToUserEntity(prismaUser) : null;
    
  }

  async requestOtp(email: string): Promise<UserEntity |null> {
    let user = await this.findByEmail(email);// Try to find user
    if(!user){
      console.log(`User not found for email: ${email}. Creating new user.`);
      try{
        const newUserPrisma = await prisma.user.create({
          data:{
            email:email,
            isAdmin:false,
            firstName: '', // Provide a default empty string or null if nullable
            lastName: '',  // Provide a default empty string or null if nullable
            password: '', 
          },
        });
        user= this.mapPrismaUserToUserEntity(newUserPrisma);
        console.log(`new user is created ${email}`);
      }catch(error){
        console.error(`Error creating new user for email :${email}`,error);
        return null;
      }
    }
    const otp = Math.floor(100000+Math.random()*900000).toString(); // it generate the 6 digit otp
    const otpExpiresAt = new Date(Date.now()+OTP_EXPIRY_MINUTES*60*1000); //otp expire minutes from now
    try {
      //save otp  and expiry  to the user record
      await prisma.user.update({
        where:{id:user.id},
        data:{
          otp:otp,
          otpExpiresAt:otpExpiresAt
        }
      });
      //send otp by email
      await transporter.sendMail({
        from:process.env.EMAIL_USER, //sender address
        to:user.email,
        subject:'you login otp',
        text:`your one time password (otp) is :${otp}it is valid for ${OTP_EXPIRY_MINUTES} minutes`,
        html:`<b>Your One-Time Password (OTP) is: ${otp}</b>.<br>It is valid for ${OTP_EXPIRY_MINUTES} minutes.`
      })
      console.log(`otp send successfully ${user.email}`);
      return user;
    } catch (error) {
       console.error('Error sending OTP email or saving to DB:', error);
            return null;
        }
  }


  async verifyOtpAndLogin(email: string, otp: string): Promise<LoginResponseDto> {
      const user = await this.findByEmail(email);
      if (!user) {
        console.error(`User not found for email: ${email}`);
        throw new Error('Invalid email or OTP.');
    }
      //check the otp is valid or not
      if (!user.otp || !user.otpExpiresAt) {
        console.error(`OTP or expiry missing for user: ${email}`);
        throw new Error('Invalid email or OTP.');
    }
    if(user.otp !== otp){
        console.error(`Provided OTP '<span class="math-inline">\{otp\}' does not match stored OTP '</span>{user.otp}' for user: ${email}`);
        throw new Error('Invalid OTP');
    }
      //check if otp expired
      if(new Date()>user.otpExpiresAt){
        console.error(`OTP expired for user: ${email}. Current time: ${new Date()}, Expiry: ${user.otpExpiresAt}`);
        //clear the expired otp from the database for security reason
        await prisma.user.update({
          where:{id:user.id},
          data:{otp:null,otpExpiresAt:null},
        });
        throw new Error('otp has expired .please request a new one')
    }
      //otp is valid and not expired clear it form  the database after successful verification
      await prisma.user.update({
        where:{id:user.id},
        data:{otp:null,otpExpiresAt:null},
      });
       //  Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {user,token}
  }
}
  
  
