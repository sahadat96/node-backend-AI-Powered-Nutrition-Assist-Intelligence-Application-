import { Injectable, Inject, ConflictException, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { User } from '../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from '../presentation/dto/register.dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    
    const { email, password, confirmPassword } = registerDto;

    if(password !== confirmPassword){
      throw new BadRequestException;
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser){
      throw new ConflictException('Email already exist');
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

