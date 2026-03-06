import { Controller, Post, Body, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './dto/register dto/register.dto';
import { LoginDto } from './dto/login dto/login.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
    register(@Body() registerDto: RegisterDto ) {
      return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto, 
    @Res({ passthrough: true }) res: Response 
  ) {

    const response = await this.authService.login(loginDto);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    return {
      message: response.message,
      data: {
        accessToken: response.data.accessToken,
        user: response.data.user
      }
    };
  }

 @Post('refresh')
  async refresh(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ) {

    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    
    const tokens = await this.authService.refreshToken(
      payload.sub,
      refreshToken,
    );
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:  24 * 60 * 60 * 1000,
    });
    
    return { accessToken: tokens.accessToken };
  }

}