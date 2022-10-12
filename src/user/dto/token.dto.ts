import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class TokenDto {
  @ApiProperty()
  expiresIn: string;
  @ApiProperty()
  token: string;
}

export class TokenResponseDto extends TokenDto {
  @ApiProperty()
  user: Partial<UserDto>;
}
