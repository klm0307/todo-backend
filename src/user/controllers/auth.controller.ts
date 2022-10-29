import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login-user.dto';
import { AuthService } from '../providers/auth.service';
import { TokenResponseDto } from '../dto/token.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
@ApiHeader({ name: 'Accept-Language', description: 'Lang' })
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenResponseDto })
  async login(@Body() payload: LoginDto): Promise<TokenResponseDto> {
    return await this.authService.login(payload);
  }

  @Post('reset-password/:email')
  @ApiCreatedResponse({ type: Boolean })
  async resetPassword(@Param('email') email: string): Promise<boolean> {
    return await this.authService.resetPassword(email);
  }

  @Post('change-password')
  @ApiCreatedResponse({ type: Boolean })
  async changePassword(@Body() payload: ChangePasswordDto): Promise<boolean> {
    return await this.authService.changePassword(payload);
  }
}
