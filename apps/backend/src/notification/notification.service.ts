// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {

  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async createMessageNotification(
    createNotificationDto: CreateNotificationDto,
  ) {
    const notification = await this.prisma.notifications.create({
      data: {
        ...createNotificationDto,
        createdAt: new Date(),
      },
    });

    this.notificationGateway.sendNotification(notification);
    return this.formateNotificationMessage(notification);
  }

  findOne(notificationId: number) {
    throw new Error('Method not implemented.');
  }

  findAll() {
    throw new Error('Method not implemented.');
  }

  async findByUserId(userId: number, filter?: any) {
    const limit = filter?.limit ? parseInt(filter.limit, 10) : 20;
    const offset = filter?.offset ? parseInt(filter.offset, 10) : 0;

    const [rawNotifications, unreadCount] = await Promise.all([
      this.prisma.notifications.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notifications.count({
        where: { userId, isRead: false },
      }),
    ]);

    const formatedNotifications = rawNotifications.map((notif) =>
      this.formateNotificationMessage(notif),
    );

    return {
      notifications: formatedNotifications,
      unreadCount,
    };
  }

  markAsRead(notificationId: number) {
    return this.prisma.notifications.update({
      where: { notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    await this.prisma.notifications.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  }

  async findMessagesNotiByUserId(userId: number) {
    const [notifications, unReadCount] = await Promise.all([
      this.prisma.notifications.findMany({
        where: { userId, type: 'message' },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.message.count({
        where: { receiverId: userId, NOT: { status: 'read'} },
      }),
    ]);

    const formatedNotifications = notifications.map((notif) =>
      this.formateNotificationMessage(notif),
    );

    return {
      notifications: formatedNotifications,
      unreadCount: unReadCount,
    };
  }

  private formateNotificationMessage(notification: any) {
    return {
      id: notification.notificationId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      time: notification.createdAt,
      read: notification.isRead,
      link: notification.link || '',
    };
  }
}
