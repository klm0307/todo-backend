import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dto/login-user.dto';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../strategies/jwt.strategy';
import { EnvVariables } from '../../app-config/environment/env-variables.enum';
import { TokenDto, TokenResponseDto } from '../dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = payload;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validatePassword = await compare(password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException('Password is not valid');
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
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
