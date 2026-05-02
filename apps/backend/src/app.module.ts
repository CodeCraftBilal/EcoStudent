import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { ReviewModule } from './review/review.module';
import { FavoriteModule } from './favorite/favorite.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { RealtimeModule } from './realtime/realtime.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { SearchhistoryModule } from './searchhistory/searchhistory.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    UsersModule, 
    AuthModule, ProductModule, UploadModule, ReviewModule, FavoriteModule, OrderModule, ChatModule, RealtimeModule, MessageModule, NotificationModule, SearchhistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // apply to all routes
  }
}
