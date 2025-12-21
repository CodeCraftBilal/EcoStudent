import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { FindMessagesDto } from './dto/find-messages.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto, @Req() req) {
    return this.chatService.create(createChatDto, req.user.id);
  }

  @Get('conversations')
  getConversations(@Query() query, @Req() req) {
    return this.chatService.getConversations(query, req.user.id);
  }

  @Get('messages/:id') 
  getMessages(@Param('id') chatId: string, @Req() req, @Query() query) {
    console.log('params: ', chatId)
    return this.chatService.getMessages(req.user.id, +chatId, query)
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
