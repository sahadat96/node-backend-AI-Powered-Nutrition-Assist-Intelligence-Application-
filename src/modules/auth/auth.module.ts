import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { 
        expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h')as any, 
      },
      }),
    }),
  ],
  controllers:[AuthController],
  providers:[
    AuthService,
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})

export class AuthModule {}