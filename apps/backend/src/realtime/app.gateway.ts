import { Inject, UseGuards } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import jwtConfig from 'src/auth/config/jwt.config';
import { WsJwtGuard } from 'src/auth/gaurds/ws-jwt-auth/ws-jwt.guard';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events';
import { MessageService } from 'src/message/message.service';
import { NotificationService } from 'src/notification/notification.service';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async handleConnection(client: Socket) {
    console.log('New client connected:', client.id);
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret as string,
      });

      const user = await this.authService.validateJWTUser(
        payload.sub,
        payload.tokenVersion,
      );

      client.data.userId = user.id;
      client.data.role = user.role;

      client.join(`user_${user.id}`);

      console.log(`Client connected: ${client.id} (User ID: ${user.id})`);
    } catch {
      client.disconnect();
    }
  }

  private extractToken(client: Socket): string | null {
    const cookieHeader = client.handshake.headers?.cookie;
    
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => c.trim().split('=')),
    );

    return cookies['access_token'] || null;
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE_SEND)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    console.log('handleSendMessage payload', payload);
    const senderId = client.data.userId;

    this.server.emit(SOCKET_EVENTS.MESSAGE_RECEIVE, { status: 'ok' });
    const message = await this.messageService.createMessage(senderId, payload);

    // Emit to chat participants
    this.server
      .to(`user_${message.receiverId}`)
      .emit(SOCKET_EVENTS.MESSAGE_NEW, message);

    // Emit notification
    const notification =
      await this.notificationService.createMessageNotification(message);

    this.server
      .to(`user:${message.receiverId}`)
      .emit(SOCKET_EVENTS.NOTIFICATION_NEW, notification);
  }
}
