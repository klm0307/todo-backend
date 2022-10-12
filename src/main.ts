import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvVariables } from './app-config/environment/env-variables.enum';
import { AppModule } from './app.module';
import { AppLoggerService } from './app-config/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const logger = await app.resolve(AppLoggerService);
  logger.setContext('Bootstrap');

  const port = config.get(EnvVariables.APP_PORT);
  const prefix = config.get(EnvVariables.APP_GLOBAL_PREFIX);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.setGlobalPrefix(`/${prefix}`);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Todo Api')
    .addBearerAuth(
      {
        description: 'JWT to authenticate',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup(`/${prefix}/doc`, app, swaggerDocument);

  await app.listen(port);

  logger.log(`🚀 Todo api run on http://localhost:${port}/${prefix}`);
}
bootstrap();
