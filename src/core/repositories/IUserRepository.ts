import prisma from "@/lib/prisma";
import { UserEntity } from "../entities/User.entity";
import { CreateUserDto,UpdateUserDto,userResponseDto } from "../dtos/User.dto";
import * as bcrypt from 'bcryptjs';
export interface IUserRepository {
    findAll(): Promise<UserEntity[]>;
    findById(id:String):Promise<UserEntity |null>;
    create(userData:CreateUserDto):Promise<UserEntity>;
    update(id:String, data :Partial<UpdateUserDto>):Promise<UserEntity>;
    delete(id:String):Promise<void>
    findByEmail(email:String):Promise<UserEntity |null>;
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
      prismaUser.phone || undefined
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
}