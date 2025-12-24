// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  
  constructor(private prisma: PrismaService) {}

  async createMessageNotification(message: any) {
    return this.prisma.notifications.create({
      data: {
        userid: message.receiverId,
        type: 'MESSAGE',
        title: 'New Message',
        message: message.content,
        relatedentitytype: 'chat',
        relatedentityid: message.chatId,
        created_at: new Date(),
      },
    });
  }

  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  
}
