import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import type { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('WsJwtGuard: canActivate called');
    const client: Socket = context.switchToWs().getClient();

    const token = this.extractToken(client);
    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret as string,
      });

      // Validate against DB (tokenVersion check)
      const user = await this.authService.validateJWTUser(
        payload.sub,
        payload.tokenVersion,
      );

      // Attach useful info to socket
      client.data.userId = user.id;
      client.data.role = user.role;
      client.data.tokenVersion = user.tokenVersion;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(client: Socket): string | null {
    // 1. From Authorization header
    const authHeader =
      client.handshake.headers?.authorization as string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // 2. From cookies (access_token)
    const cookieHeader = client.handshake.headers?.cookie;
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => c.trim().split('=')),
    );

    return cookies['access_token'] || null;
  }
}
