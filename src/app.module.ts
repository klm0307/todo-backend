import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [AppConfigModule, UserModule, TodoModule, EmailModule],
})
export class AppModule {}
