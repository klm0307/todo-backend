import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @ApiPropertyOptional({
    description: 'Unique id of user to find',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Name of user to find',
    example: 'Test user',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique email of user to find',
    example: 'test@mail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
