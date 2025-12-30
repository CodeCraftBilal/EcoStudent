import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ReviewService } from 'src/review/review.service';
import { OrderGateway } from './order.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { MessageService } from 'src/message/message.service';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider()),
    MessageModule
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderGateway,
    PrismaService,
    ProductService,
    ReviewService,
    NotificationService,
    NotificationGateway,
    ChatService,
    UsersService
  ],
  exports: [OrderService],
})
export class OrderModule {}
