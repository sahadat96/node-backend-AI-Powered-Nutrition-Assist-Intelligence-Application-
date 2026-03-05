import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/register.dto/login.dto';
import { PassThrough } from 'stream';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Post('register')
    register(@Body() registerDto: RegisterDto ) {
      return this.authService.register(registerDto);
  }

  // @Post('login')
  //   async login(
  //   @Body() loginDto: LoginDto, 
  //   @Res({ passthrough: true }) res: Response
  // ) {

  //   const { accessToken, refreshToken } = this.authService.login()
  //     return this.authService.login(loginDto);
  // }

}