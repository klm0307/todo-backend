import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dto/login-user.dto';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../strategies/jwt.strategy';
import { TokenDto, TokenResponseDto } from '../dto/token.dto';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { EnvVariables } from '@config/environment/env-variables.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async login(payload: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = payload;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(this.i18n.translate('auth.not_found'));
    }

    const validatePassword = await compare(password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException(this.i18n.translate('auth.unauthorized'));
    }

    const signedToken = this.createToken(user);

    return {
      ...signedToken,
      user: {
        name: user.name,
      },
    };
  }

  private createToken({ id }): TokenDto {
    const user: JwtPayload = { userId: id };
    const token = this.jwtService.sign(user);
    return {
      expiresIn: this.config.get(EnvVariables.JWT_EXPIRES_IN),
      token,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException(this.i18n.translate('auth.unauthorized'));
    }
    return user;
  }
}
