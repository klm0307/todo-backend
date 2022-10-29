import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Jwt token',
    example: '',
  })
  @IsJWT()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'randomPass',
  })
  @IsString()
  newPassword: string;
}
