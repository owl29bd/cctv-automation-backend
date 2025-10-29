import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
import { apiReference } from '@scalar/nestjs-api-reference';
import { json } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filter/http.exception-filter';
import { flattenValidationErrors } from './utils/validation.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT') || 5000;

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(flattenValidationErrors(errors)),
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Setup
  const options = new DocumentBuilder()
    .addServer('/api')
    .setTitle('API Doc')
    .setDescription('The API description')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  // JSON limit
  app.use(json({ limit: '50mb' }));

  // Global prefix
  app.setGlobalPrefix('api');

  // Start listening
  await app.listen(port);

  const appUrl = await app.getUrl();

  console.log(`Application is running on: ${appUrl}/api`);
  console.log(`Swagger is running on: ${appUrl}/swagger`);
  console.log(`API Reference is running on: ${appUrl}/reference`);
}

bootstrap();
