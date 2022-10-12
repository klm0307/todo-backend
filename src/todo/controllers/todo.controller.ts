import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoService } from '../providers/todo.service';
import { FilterTodoDto } from '../dto/filter-todo.dto';
import { TodoDto } from '../dto/todo.dto';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { User } from '@/user/decorators/user.decorator';
import { UserDto } from '@/user/dto/user.dto';
import { JwtGuard } from '@/user/guards/jwt.guard';

@ApiTags('Todo')
@UseGuards(JwtGuard)
@ApiBearerAuth('jwt')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(@User() user: UserDto, @Body() payload: CreateTodoDto) {
    return this.todoService.createTodo({ ...payload, userId: user.id });
  }

  @Post(':id/subtask')
  createTodoSubtask(
    @User() user: UserDto,
    @Param('id')
    todoId: string,
    @Body() payload: CreateSubtaskDto,
  ) {
    return this.todoService.createTodo({ ...payload, userId: user.id, todoId });
  }

  @Patch(':id')
  updateTodo(@Param('id') id: string, @Body() payload: UpdateTodoDto) {
    return this.todoService.updateTodo(id, payload);
  }

  @Get()
  findAllTodos(@User() user: UserDto, @Query() query: FilterTodoDto) {
    return this.todoService.findAllTodos({ ...query, userId: user.id });
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
