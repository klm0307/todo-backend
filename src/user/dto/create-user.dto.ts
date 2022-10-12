import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto implements Partial<User> {
  @ApiProperty({
    description: 'Name of user to create',
    example: 'Test user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of user to create',
    example: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of user to create',
    example: 'randomPass',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Photo url of user to create',
    example: 'http://image.com',
  })
  @IsString()
  @IsNotEmpty()
  photoUrl: string;
}
