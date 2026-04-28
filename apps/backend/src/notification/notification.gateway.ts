import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "src/common/constants/socket-events";

@WebSocketGateway()
export class NotificationGateway {
    @WebSocketServer()
    server: Socket;

    sendNotification(notification: any) {
        this.server.to(`user_${notification.userId}`).emit(SOCKET_EVENTS.NOTIFICATION.NEW, notification);
    }
}