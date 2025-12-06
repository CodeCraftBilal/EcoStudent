import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    UsersModule, 
    AuthModule, ProductModule, UploadModule, ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
