import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports:[
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { 
        expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h') as any, 
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
  exports: [JwtModule],
})

export class AuthModule implements NestModule {

   configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
  //.exclude('health')
    .forRoutes(AuthController);
  }
}