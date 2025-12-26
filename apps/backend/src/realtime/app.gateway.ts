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
import { SOCKET_EVENTS } from 'src/common/constants/socket-events';
import { MessageService } from 'src/message/message.service';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
@WebSocketGateway({
  cors: {
    origin: '*',
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
    private readonly userService: UsersService,
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

      await this.userService.update(user.id, { isOnline: true });

      client.data.userId = user.id;
      client.data.role = user.role;

      client.join(`user_${user.id}`);

      console.log(`Client connected: ${client.id} (User ID: ${user.id})`);
    } catch(err) {
      console.log('something went wrong: ', err)
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

  async handleDisconnect(client: Socket) {
    await this.userService.update(client.data.userId, { isOnline: false });
    console.log(`Client disconnected: ${client.id}`);
  }
}
