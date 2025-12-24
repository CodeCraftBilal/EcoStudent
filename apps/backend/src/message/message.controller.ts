// src/message/message.controller.ts
import { Controller, Get, Query, Req } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMessages(@Req() req, @Query() query: any) {
    return this.chatService.getMessages(
      req.user.id,
      Number(query.chatId),
      query,
    );
  }
}
