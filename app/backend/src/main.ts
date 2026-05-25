import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { AppDataSource } from './database/typeorm.config';
import { runSeeders } from './database/seeders/seeder';

async function bootstrap() {
  const dataSource = await AppDataSource.initialize();
  await dataSource.runMigrations();
  console.log('✅ Migrations applied');

  if (process.env.NODE_ENV === 'development') {
    await runSeeders(dataSource);
  }

  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Second Brain API')
    .setDescription(
      'REST API for AI Second Brain — documents, chat, and AI generation',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 Backend running on http://localhost:${process.env.PORT ?? 3001}`,
  );
}
bootstrap();
