import { Module } from '@nestjs/common';
import { TodoService } from './providers/todo.service';
import { TodoController } from './controllers/todo.controller';
import { SubtaskController } from './controllers/subtask.controller';

@Module({
  providers: [TodoService],
  controllers: [TodoController, SubtaskController],
})
export class TodoModule {}
