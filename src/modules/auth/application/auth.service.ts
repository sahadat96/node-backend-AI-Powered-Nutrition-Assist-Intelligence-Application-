import { Injectable, Inject, ConflictException, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { User } from '../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(
      uuidv4(),
      email,
      hashedPassword,
      'USER',
    );

    const savedUser = await this.userRepository.create(newUser);

    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }

}

