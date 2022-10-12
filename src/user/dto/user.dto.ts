import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class UserDto implements User {
  @ApiProperty({
    description: 'Id of user',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Name of user',
    example: 'Test user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of user',
    example: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of user',
    example: 'randomPass',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Photo url of user',
    example: 'http://image.com',
  })
  @IsString()
  @IsNotEmpty()
  photoUrl: string;

  @ApiProperty({
    description: 'Created at of user',
    example: '2022-10-10T20:42:13.341Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at of user',
    example: '2022-10-10T20:42:13.341Z',
  })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    description: 'Deleted at user property for soft delete',
    example: '2022-10-10T20:42:13.341Z',
  })
  @IsDateString()
  deletedAt: Date;
}
