// src/message/message.service.ts
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './dto/create-message.dto';
import { NotificationService } from 'src/notification/notification.service';
import { ChatService } from 'src/chat/chat.service';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  
  constructor(private prisma: PrismaService,
    private notificationService: NotificationService,
    private readonly chatService: ChatService
  ) {}

  async createMessage(senderId: number, dto: SendMessageDto) {
  const chat = await this.prisma.chat.findFirst({
    where: {
      chatId: dto.chatId,
      OR: [{ senderId }, { receiverId: senderId }],
    },
  });

  if (!chat) throw new NotFoundException('Chat not found');

  // 🔹 Check if this is the first message in the chat
  const messageCount = await this.prisma.message.count({
    where: { chatId: dto.chatId },
  });

  const isFirstMessage = messageCount === 0;

  // 🔹 Create message
  const message = await this.prisma.message.create({
    data: {
      chatId: dto.chatId,
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
      messageType: dto.messageType,
    },
  });

  // 🔹 Update chat preview
  await this.prisma.chat.update({
    where: { chatId: dto.chatId },
    data: {
      lastMessage: dto.content,
      lastMessageAt: new Date(),
    },
  });

  // 🔔 Create notification ONLY for first message
  if (isFirstMessage) {
    await this.notificationService.createMessageNotification({
      userId: dto.receiverId,
      type: 'message',
      title: 'New Message',
      message: 'You have received a new message',
      relatedEntityType: 'CHAT',
      relatedEntityId: dto.chatId,
    });
  }

  return {
    id: message.messageId.toString(),
    chatId: message.chatId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    type: message.messageType,
    timestamp: message.createdAt?.toISOString(),
  };
}

getMessagesByUserId(userId: number, query:any) {
  this.chatService.getMessages(
    userId,
    Number(query.chatId),
    query,
  );
}


}