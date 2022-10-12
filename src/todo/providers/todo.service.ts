import { AppLoggerService } from '@/app-config/logger/logger.service';
import { PrismaService } from '@/app-config/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { TodoDto } from '../dto/todo.dto';
import { FilterTodoDto } from '../dto/filter-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { Prisma } from '@prisma/client';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';

type PartialFilter = Partial<FilterTodoDto>;

@Injectable()
export class TodoService {
  private context = this.constructor.name;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly prisma: PrismaService,
  ) {}
  async createTodo(
    payload: CreateTodoDto | CreateSubtaskDto,
  ): Promise<TodoDto> {
    const context = {
      method: this.createTodo.name,
      payload,
    };

    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Creating todo',
      });

      const todo = await this.prisma.todo.create({
        data: { ...payload },
        include: { subtasks: true },
      });

      this.logger.customLog(this.context, {
        context,
        message: `Todo created with id ${todo.id}`,
      });

      return todo;
    } catch (error) {
      this.logger.customError(error);
      throw new UnprocessableEntityException(
        `An error occur when try to create todo`,
      );
    }
  }

  async updateTodo(id: string, payload: UpdateTodoDto) {
    const context = {
      method: this.createTodo.name,
      payload,
    };

    const [exist] = await this.findAllTodos({ id });

    if (!exist) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Updating todo',
      });

      const todo = await this.prisma.todo.update({
        where: { id },
        data: payload,
        include: { subtasks: true },
      });

      this.logger.customLog(this.context, {
        context,
        message: `Todo updated with id ${todo.id}`,
      });

      return todo;
    } catch (error) {
      this.logger.customError(error);
      throw new UnprocessableEntityException(
        `An error occur when try to update todo`,
      );
    }
  }

  async findTodoById(id: string) {
    const [todo] = await this.findAllTodos({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  async findAllTodos(query: PartialFilter = {}): Promise<TodoDto[]> {
    const context = {
      method: this.findAllTodos.name,
      filter: { ...query },
    };

    try {
      const { id } = query;
      const where: Prisma.TodoWhereInput = {};

      if (id) {
        where.id = {
          equals: id,
        };
      }

      this.logger.customLog(this.context, {
        ...context,
        message: 'Finding all todos',
      });

      const todos = await this.prisma.todo.findMany({
        where,
        include: { subtasks: true },
      });

      this.logger.customLog(this.context, {
        context,
        message: `Found ${todos.length} todos`,
      });

      return todos;
    } catch (error) {
      this.logger.customError(error);
      throw new BadRequestException(
        `An error occur when try to find all users`,
      );
    }
  }

  async deleteTodo(id: string): Promise<TodoDto> {
    const context = {
      method: this.deleteTodo.name,
      id,
    };

    await this.findTodoById(id);

    try {
      this.logger.customLog(this.context, {
        ...context,
        message: 'Deleting user',
      });

      const todo = await this.prisma.todo.delete({
        where: { id },
      });

      this.logger.customLog(this.context, {
        context,
        message: `Todo with id ${todo.id} deleted`,
      });
      return todo;
    } catch (error) {
      throw new UnprocessableEntityException(
        `An error occur when try to delete user with id ${id}`,
      );
    }
  }
}
