import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService, ChatService, UsersService],
})
export class MessageModule {}
