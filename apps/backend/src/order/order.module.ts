import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ReviewService } from 'src/review/review.service';
import { OrderGateway } from './order.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider())],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderGateway,
    PrismaService,
    ProductService,
    ReviewService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
