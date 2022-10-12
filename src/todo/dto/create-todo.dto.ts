import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Todo, TodoStatus } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto implements Partial<Todo> {
  @ApiProperty({ description: 'Description of todo', example: '' })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'enum',
    enum: TodoStatus,
    description: 'Status of todo',
    example: TodoStatus.TODO,
  })
  @IsString()
  status: TodoStatus;

  @ApiPropertyOptional({
    description: 'Id of user',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Expiration at of todo', example: '' })
  @IsDateString()
  @IsOptional()
  expiredAt?: Date;
}
