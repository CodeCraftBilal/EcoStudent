  // src/order/order.gateway.ts
  import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { UseGuards, Logger, forwardRef, Inject } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { WsJwtGuard } from '../auth/gaurds/ws-jwt-auth/ws-jwt.guard';
  import { OrderService } from './order.service';
  import { SOCKET_EVENTS } from '../common/constants/socket-events';

  interface OrderEventData {
    orderId?: number;
    conversationId?: number;
    buyerId?: number;
    sellerId?: number;
    status?: string;
    data?: any;
  }

  @WebSocketGateway({
    namespace: '/orders',
    cors: {
      origin: '*',
      credentials: true,
    },
  })
  export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger(OrderGateway.name);
    private connectedUsers = new Map<number, string>(); // userId -> socketId

    constructor(
      private readonly jwtService: JwtService,
      @Inject(forwardRef(() => OrderService))
    private readonly ordersService: OrderService,
    ) {}

    async handleConnection(client: Socket) {
      try {
        const token = this.extractToken(client);
        if (!token) {
          client.disconnect();
          return;
        }

        const payload = await this.jwtService.verifyAsync(token);
        const userId = payload.sub;

        // Store socket connection
        this.connectedUsers.set(userId, client.id);
        client.data.userId = userId;

        // Join user's personal room
        client.join(`user_${userId}`);

        this.logger.log(`Order client connected: ${client.id} (User: ${userId})`);
      } catch (error) {
        this.logger.error(`Connection error: ${error.message}`);
        client.disconnect();
      }
    }

    async handleDisconnect(client: Socket) {
      const userId = client.data?.userId;
      if (userId) {
        this.connectedUsers.delete(userId);
        this.logger.log(`Order client disconnected: ${client.id} (User: ${userId})`);
      }
    }

    private extractToken(client: Socket): string | null {
      const authHeader = client.handshake.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }

      const cookieHeader = client.handshake.headers?.cookie;
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map((c) => c.trim().split('=')),
        );
        return cookies['access_token'] || null;
      }

      return null;
    }

    // Join a conversation room for real-time updates
    @SubscribeMessage(SOCKET_EVENTS.ORDER.JOIN_CONVERSATION)
    @UseGuards(WsJwtGuard)
    async handleJoinConversation(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { conversationId: number },
    ) {
      const userId = client.data.userId;
      client.join(`conversation_${data.conversationId}`);
      this.logger.log(`User ${userId} joined conversation ${data.conversationId}`);
      return { success: true };
    }

    // Leave a conversation room
    @SubscribeMessage(SOCKET_EVENTS.ORDER.LEAVE_CONVERSATION)
    @UseGuards(WsJwtGuard)
    async handleLeaveConversation(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: { conversationId: number },
    ) {
      client.leave(`conversation_${data.conversationId}`);
      return { success: true };
    }

    // Emit order created event
    async emitOrderCreated(order: any, conversationId: number) {
      const eventData: OrderEventData = {
        orderId: order.id,
        conversationId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        status: order.status,
        data: order,
      };

      // Emit to conversation room
      this.server.to(`conversation_${conversationId}`).emit(
        SOCKET_EVENTS.ORDER.CREATED,
        eventData
      );

      // Emit to buyer and seller personally
      this.server.to(`user_${order.buyerId}`).emit(
        SOCKET_EVENTS.ORDER.CREATED,
        eventData
      );
      this.server.to(`user_${order.sellerId}`).emit(
        SOCKET_EVENTS.ORDER.CREATED,
        eventData
      );

      this.logger.log(`Order ${order.id} created, emitted to conversation ${conversationId}`);
    }

    // Emit order updated event
    async emitOrderUpdated(order: any, conversationId: number) {
      const eventData: OrderEventData = {
        orderId: order.id,
        conversationId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        status: order.status,
        data: order,
      };

      this.server.to(`conversation_${conversationId}`).emit(
        SOCKET_EVENTS.ORDER.UPDATED,
        eventData
      );

      this.server.to(`user_${order.buyerId}`).emit(
        SOCKET_EVENTS.ORDER.UPDATED,
        eventData
      );
      this.server.to(`user_${order.sellerId}`).emit(
        SOCKET_EVENTS.ORDER.UPDATED,
        eventData
      );

      this.logger.log(`Order ${order.id} updated`);
    }

    // Emit order status changed event
    async emitOrderStatusChanged(order: any, conversationId: number, oldStatus: string) {
      const eventData: OrderEventData = {
        orderId: order.id,
        conversationId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        status: order.status,
        data: {
          ...order,
          previousStatus: oldStatus,
          timestamp: new Date().toISOString(),
        },
      };

      this.server.to(`conversation_${conversationId}`).emit(
        SOCKET_EVENTS.ORDER.STATUS_CHANGED,
        eventData
      );

      this.server.to(`user_${order.buyerId}`).emit(
        SOCKET_EVENTS.ORDER.STATUS_CHANGED,
        eventData
      );
      this.server.to(`user_${order.sellerId}`).emit(
        SOCKET_EVENTS.ORDER.STATUS_CHANGED,
        eventData
      );

      this.logger.log(`Order ${order.id} status changed from ${oldStatus} to ${order.status}`);
    }

    // Emit order cancelled event
    async emitOrderCancelled(order: any, conversationId: number, reason?: string) {
      const eventData: OrderEventData = {
        orderId: order.id,
        conversationId,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        status: order.status,
        data: {
          ...order,
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
        },
      };

      this.server.to(`conversation_${conversationId}`).emit(
        SOCKET_EVENTS.ORDER.CANCELLED,
        eventData
      );

      this.server.to(`user_${order.buyerId}`).emit(
        SOCKET_EVENTS.ORDER.CANCELLED,
        eventData
      );
      this.server.to(`user_${order.sellerId}`).emit(
        SOCKET_EVENTS.ORDER.CANCELLED,
        eventData
      );

      this.logger.log(`Order ${order.id} cancelled`);
    }

    // Get connected user IDs
    getConnectedUsers(): number[] {
      return Array.from(this.connectedUsers.keys());
    }

    // Check if user is connected
    isUserConnected(userId: number): boolean {
      return this.connectedUsers.has(userId);
    }
  }