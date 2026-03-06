import { Injectable, Inject, ConflictException, UnauthorizedException, BadRequestException, ForbiddenException  } from '@nestjs/common';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { User } from '../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from '../presentation/dto/register dto/register.dto';
import { LoginDto } from '../presentation/dto/login dto/login.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  private async getTokens(userId: string, email: string, role: string) {
    const jwtPayload = { sub: userId, email, role };

    const[accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '10m',
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(userId, hash);
  }

  async login(loginDto: LoginDto){

    const { email, password } = loginDto;
    const user = await this.userRepository.findByEmail(email);

    if(!user){
      throw new ConflictException('Invalid Creadential');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid){
      throw new UnauthorizedException('Invalid Creadential')
    }

    const token = await this.getTokens(user.id, user.email, user.role);

    await this.updateRefreshTokenHash(user.id, token.refreshToken);
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    };
    
  }

  async refreshToken(userId: string, refreshToken: string){

    const user = await this.userRepository.findById(userId);

    if (!user) throw new ForbiddenException('Access Denied');
    
    const storeRefreshTokenHash = await this.userRepository.getRefreshToken(userId);

    if (!storeRefreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, storeRefreshTokenHash);

    if (!isRefreshTokenValid){
      throw new ForbiddenException('Access Denied');
    }

    const token = await this.getTokens(user.id, user.email, user.role);

    await this.updateRefreshTokenHash(user.id, token.refreshToken);

    return token;
  }

}

