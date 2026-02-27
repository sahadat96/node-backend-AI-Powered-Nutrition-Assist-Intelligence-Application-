import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { User } from "../../domain/entities/user.entity"

@Injectable()
exports class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService){}
    
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
}