import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "src/common/constants/socket-events";
import { MessageService } from "./message.service";
import { Server } from "socket.io";

@WebSocketGateway()
export class MessageGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly messageService: MessageService,
    ) {}
    
  @SubscribeMessage(SOCKET_EVENTS.MESSAGE_SEND)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    console.log('handleSendMessage payload', payload);
    const senderId = client.data.userId;

    client.emit('message-received', { status: 'ok' });
    const message = await this.messageService.createMessage(senderId, {...payload.data});
    // Emit to chat participants
    this.server
      .to(`user_${message.receiverId}`)
      .emit(SOCKET_EVENTS.MESSAGE_RECEIVE, message);

    // Emit notification
  //   const notification =
  //     await this.notificationService.createMessageNotification(message);

  //   this.server
  //     .to(`user:${message.receiverId}`)
  //     .emit(SOCKET_EVENTS.NOTIFICATION_NEW, notification);
  }
}