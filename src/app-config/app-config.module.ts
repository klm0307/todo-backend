import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { NodeEnv } from './environment/node-env.enum';
import { AppLoggerService } from './logger/logger.service';
import { PrismaService } from './prisma/prisma.service';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

const config: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: `env/${process.env.NODE_ENV}.env`,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid(NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION)
      .required(),
  }),
};

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(config),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(`${process.cwd()}/dist/app-config`, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  providers: [AppLoggerService, PrismaService],
  exports: [AppLoggerService, PrismaService],
})
export class AppConfigModule {}
