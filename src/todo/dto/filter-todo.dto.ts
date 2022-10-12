import { ApiPropertyOptional } from '@nestjs/swagger';
import { TodoStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class FilterTodoDto {
  @ApiPropertyOptional({
    description: 'Unique id of todo to find',
    example: '',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Status of todo to find',
    example: TodoStatus.TODO,
    enum: TodoStatus,
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
