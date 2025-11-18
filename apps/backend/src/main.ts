import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const port = process.env.PORT ?? 8000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
