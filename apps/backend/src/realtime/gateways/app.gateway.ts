import { Inject, UseGuards } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import jwtConfig from "src/auth/config/jwt.config";
import { WsJwtGuard } from "src/auth/gaurds/ws-jwt-auth/ws-jwt.guard";
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class AppGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async handleConnection(client: Socket) {
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

      console.log(
        `Client connected: ${client.id} (User ID: ${user.id})`,
      );
    } catch {
      client.disconnect();
    }
  }

  private extractToken(client: Socket): string | null {
    const cookieHeader = client.handshake.headers?.cookie;
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => c.trim().split('=')),
    );

    return cookies['access_token'] || null;
  }

    handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    }
}
