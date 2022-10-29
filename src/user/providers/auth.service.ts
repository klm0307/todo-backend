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
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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

  async resetPassword(email: string): Promise<boolean> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    /*  const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await hash(newPassword, 10);

    await this.userService.updateUser(user.id, {
      password: hashedPassword,
    }); */

    const token = this.createToken({ id: user.id });

    const url = `${this.config.get(
      EnvVariables.FRONTEND_URL,
    )}/auth/change-password/${email}/${token}`;

    const emailResponse = await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      template: 'reset-password.hbs',
      context: {
        name: user.name,
        url,
      },
    });

    return emailResponse.accepted.length > 0;
  }

  async changePassword(payload: ChangePasswordDto): Promise<boolean> {
    const { token, newPassword } = payload;
    const user = await this.validateUser(token);

    const hashedPassword = await hash(newPassword, 10);

    await this.userService.updateUser(user.id, {
      password: hashedPassword,
    });

    const emailResponse = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Change password',
      template: 'change-password.hbs',
      context: {
        name: user.name,
      },
    });

    return emailResponse.accepted.length > 0;
  }
}
