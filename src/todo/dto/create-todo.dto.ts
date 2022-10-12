import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Todo, TodoStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

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
  @IsEnum(TodoStatus)
  status: TodoStatus;

  @ApiPropertyOptional({
    description: 'Expiration at of todo',
    example: null,
    default: null,
  })
  @ValidateIf((value) => value && value.length > 0)
  @IsDateString()
  @IsOptional()
  expiredAt?: Date;
}
