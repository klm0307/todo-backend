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
    description: 'Expiration at of todo',
    example: '',
    default: null,
  })
  @IsDateString()
  @IsOptional()
  expiredAt?: Date;
}
