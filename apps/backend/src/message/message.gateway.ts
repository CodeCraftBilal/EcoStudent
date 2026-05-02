import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.MESSAGE_SEND)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    
    const senderId = client.data.userId;

    client.emit('message-received', { status: 'ok' });
    const message = await this.messageService.createMessage(senderId, {
      ...payload.data,
    });
    // Emit to chat participants
    this.server
      .to(`user_${message.receiverId}`)
      .emit(SOCKET_EVENTS.MESSAGE.MESSAGE_RECEIVE, message);
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.MESSAGE_READ)
  async handleSubscribeMessageRead(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    
    
    const readMsg = await this.messageService.markAllAsRead(parseInt(data.chatId), client.data.userId)
    
    
    this.server.to(`user_${readMsg.userId}`).emit(SOCKET_EVENTS.MESSAGE.MESSAGE_READ, {chatId: readMsg.chatId});
  }
}
