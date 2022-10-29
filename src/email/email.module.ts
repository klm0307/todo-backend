import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVariables } from '@/app-config/environment/env-variables.enum';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get(EnvVariables.EMAIL_HOST),
          port: configService.get(EnvVariables.EMAIL_PORT),
          secure: false,
          auth: {
            user: configService.get(EnvVariables.EMAIL_USER),
            pass: configService.get(EnvVariables.EMAIL_PASSWORD),
          },
        },

        template: {
          dir: process.cwd() + '/dist/email/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class EmailModule {}
