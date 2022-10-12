import { ApiPropertyOptional } from '@nestjs/swagger';
import { Todo, TodoStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto implements Partial<Todo> {
  @ApiPropertyOptional({ description: 'Description of todo', example: '' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: TodoStatus,
    description: 'Status of todo',
    example: TodoStatus.TODO,
  })
  @IsString()
  @IsOptional()
  status: TodoStatus;
}
