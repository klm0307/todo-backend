import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements Partial<User> {
  @ApiPropertyOptional({
    description: 'Name of user to create(optional)',
    example: 'Test user',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email of user to create(optional)',
    example: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Photo url of user to update(optional)',
    example: 'http://image.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'User password to update(optional)',
    example: 'randowmPass',
  })
  @Exclude()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
