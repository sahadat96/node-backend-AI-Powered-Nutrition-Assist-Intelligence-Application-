import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {

  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.role,
      user.refreshToken,
      user.createdAt,
      user.updatedAt,
    );
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });

    return new User(
      created.id,
      created.email,
      created.password,
      created.role,
      created.refreshToken,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if(!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.role,
      user.refreshToken,
      user.createdAt,
      user.updatedAt
    );
  }

  async getRefreshToken(userId: string): Promise<string | null>{
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { refreshToken: true },
    });

    if(!user || !user.refreshToken){
      return null;
    }
    
    return user.refreshToken;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId},
      data: { refreshToken },
    });
  }
  
}