import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoService } from '../providers/todo.service';
import { FilterTodoDto } from '../dto/filter-todo.dto';
import { TodoDto } from '../dto/todo.dto';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(@Body() payload: CreateTodoDto) {
    return this.todoService.createTodo(payload);
  }

  @Patch(':id')
  updateTodo(@Param('id') id: string, @Body() payload: UpdateTodoDto) {
    return this.todoService.updateTodo(id, payload);
  }

  @Get()
  findAllTodos(@Query() query: FilterTodoDto) {
    return this.todoService.findAllTodos(query);
  }

  @Get(':id')
  async findTodo(@Param('id') id: string): Promise<TodoDto> {
    return this.todoService.findTodoById(id);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(id);
  }
}
