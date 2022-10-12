import { Module } from '@nestjs/common';
import { TodoService } from './providers/todo.service';
import { TodoController } from './controllers/todo.controller';

@Module({
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
