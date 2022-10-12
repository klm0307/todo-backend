import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [AppConfigModule, UserModule, TodoModule, HealthModule],
})
export class AppModule {}
