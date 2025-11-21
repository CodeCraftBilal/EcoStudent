import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const port = process.env.PORT ?? 8000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: false,
    whitelist: true,
    skipMissingProperties: true
  }));
  app.use(cookieParser());
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
