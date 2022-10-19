import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../providers/auth.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { EnvVariables } from '@config/environment/env-variables.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly i18n: I18nRequestScopeService,
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
      throw new NotFoundException(this.i18n.translate('auth.not_found'));
    }
    delete user.password;
    return user;
  }
}

export interface JwtPayload {
  userId: string;
}
