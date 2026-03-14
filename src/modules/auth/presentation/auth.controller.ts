import { Controller, Get, Post, Body, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './dto/registerDto/register.dto';
import { LoginDto } from './dto/loginDto/login.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permissions.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/common/enums/permission.enum';
import { Role } from 'src/common/enums/role.enum';
import { GoogleOAuthGuard } from 'src/common/guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req){

  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard) 
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    
    const { tokens } = await this.authService.validateGoogleLogin(req.user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

  //  const frontendUrl = this.configService.get<string>('FRONTEND_OAUTH_SUCCESS_URL');
    
  //   return res.redirect(`${frontendUrl}?token=${tokens.accessToken}`);
  }

  @Get('test')
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard )
  @Roles(Role.USER)
  @Permissions(Permission.VIEW_USER)
  get() {
    return 'Sohel Athentication test Success';
  }

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