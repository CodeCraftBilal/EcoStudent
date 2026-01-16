import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';
import { MessageGateway } from './message.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageGateway,
    PrismaService,
    ChatService,
    UsersService,
    NotificationService,
    NotificationGateway,
  ],
  exports:[MessageService, MessageGateway]
})
export class MessageModule {}
