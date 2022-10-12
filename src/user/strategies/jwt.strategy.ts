import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../../app-config/environment/env-variables.enum';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../providers/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EnvVariables.JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }
}

export interface JwtPayload {
  userId: string;
}
