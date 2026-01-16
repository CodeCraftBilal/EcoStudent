import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Patch('markallasread')
  markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Patch(':id/markasread')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(+id);
  }

  @Get('user/:userId/message')
  findMessagesNotiByUserId(@Param('userId') userId: string) {
    return this.notificationService.findMessagesNotiByUserId(+userId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string, @Body() filter: any) {
    return this.notificationService.findByUserId(+userId, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }
}
