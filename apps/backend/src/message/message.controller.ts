// src/message/message.controller.ts
import { Controller, Get, Query, Req } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService

  ) {}

  @Get()
  getMessages(@Req() req, @Query() query: any) {
    return this.messageService.getMessagesByUserId(req.user.id, query);
  }
}
