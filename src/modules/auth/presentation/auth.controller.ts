import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/register.dto/login.dto';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Post('register')
    register(@Body() registerDto: RegisterDto ) {
      return this.authService.register(registerDto);
  }

  @Post('login')
    login(@Body() loginDto: LoginDto ) {
      return this.authService.login(loginDto);
  }
  
}