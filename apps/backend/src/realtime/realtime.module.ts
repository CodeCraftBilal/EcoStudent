import { Module } from '@nestjs/common';
import { AppGateway } from './gateways/app.gateway';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import refreshConfig from 'src/auth/config/refresh.config';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forFeature(refreshConfig),],
    providers: [AppGateway, AuthService, UsersService, JwtService, PrismaService]
})
export class RealtimeModule {}