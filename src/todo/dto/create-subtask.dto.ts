import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';
export class CreateSubtaskDto extends CreateTodoDto {
  @ApiProperty({
    description: 'If a subtask this represent the todo parent id',
    example: '2c287ae8-ab38-4681-b3f7-2295c9402eeb',
  })
  @IsString()
  todoId: string;
}
