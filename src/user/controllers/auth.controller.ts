import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login-user.dto';
import { AuthService } from '../providers/auth.service';
import { TokenResponseDto } from '../dto/token.dto';
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
}
