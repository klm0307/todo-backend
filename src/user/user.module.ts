import { FileModule } from '@/file/file.module';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './providers/user.service';
import { AuthService } from './providers/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVariables } from '@/app-config/environment/env-variables.enum';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EnvVariables.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(EnvVariables.JWT_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
    FileModule,
  ],
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [UserController, AuthController],
  exports: [PassportModule, JwtModule],
})
export class UserModule {}
