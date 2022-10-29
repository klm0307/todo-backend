import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppConfigModule } from '@config/app-config.module';
import { UserModule } from '@user/user.module';
import { TodoModule } from '@todo/todo.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [AppConfigModule, UserModule, TodoModule, HealthModule, EmailModule],
})
export class AppModule {}
