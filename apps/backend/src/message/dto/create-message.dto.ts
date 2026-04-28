// src/message/dto/send-message.dto.ts
import { IsInt, IsEnum, IsString } from 'class-validator';
import { message_type } from 'generated/prisma';

export class SendMessageDto {
  @IsInt()
  chatId: number;

  @IsInt()
  receiverId: number;

  @IsEnum(message_type)
  messageType: message_type;

  @IsString()
  content: string;
}
