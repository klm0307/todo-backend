import { ApiProperty } from '@nestjs/swagger';
import { Todo, TodoStatus } from '@prisma/client';
import { IsArray, IsDateString, IsString } from 'class-validator';

export class TodoDto implements Todo {
  @ApiProperty({
    description: 'Id of todo',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  id: string;

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

  @ApiProperty({
    description: 'If a subtask this represent the todo parent id',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  todoId: string;

  @ApiProperty({
    description: 'Id of user',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: 'array',
    description: 'List of subtask',
    example: [TodoDto],
    default: [],
  })
  @IsArray()
  subtask?: TodoDto[];

  @ApiProperty({ description: 'Created at of todo', example: '' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Expiration at of todo', example: '' })
  @IsDateString()
  expiredAt: Date;

  @ApiProperty({ description: 'Updated at of todo', example: '' })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at of todo', example: '' })
  @IsDateString()
  deletedAt: Date;
}
