import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'
import * as express from 'express'
import { join } from 'path';

async function bootstrap() {
  const port = process.env.PORT ?? 8000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.1.101:3000'],
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: false,
    whitelist: true,
    skipMissingProperties: true
  }));
  app.use(cookieParser());
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
