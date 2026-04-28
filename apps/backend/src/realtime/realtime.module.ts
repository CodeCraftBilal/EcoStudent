import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import refreshConfig from 'src/auth/config/refresh.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageService } from 'src/message/message.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { ChatService } from 'src/chat/chat.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    MessageModule
  ],
  providers: [
    AppGateway,
    AuthService,
    UsersService,
    JwtService,
    PrismaService,
    NotificationService,
    NotificationGateway,
    UsersService,
    ChatService,
  ],
})
export class RealtimeModule {}
