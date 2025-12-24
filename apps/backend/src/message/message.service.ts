// src/message/message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: number, dto: SendMessageDto) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        chatId: dto.chatId,
        OR: [{ senderId }, { receiverId: senderId }],
      },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    const message = await this.prisma.message.create({
      data: {
        chatId: dto.chatId,
        senderId,
        receiverId: dto.receiverId,
        content: dto.content,
        messageType: dto.messageType,
      },
    });

    // Update chat preview
    await this.prisma.chat.update({
      where: { chatId: dto.chatId },
      data: {
        lastMessage: dto.content,
        lastMessageAt: new Date(),
      },
    });

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
}
