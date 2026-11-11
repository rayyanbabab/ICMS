import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_role_room')
  handleJoinRoleRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() role: string,
  ) {
    const roomName = `role:${role}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined ${roomName}`);
    return { status: 'joined', room: roomName };
  }

  @SubscribeMessage('ping_server')
  handlePing() {
    return { status: 'pong', timestamp: new Date().toISOString() };
  }

  /**
   * Broadcast real-time announcement to all connected clients
   */
  broadcastNotification(notification: {
    id: string;
    title: string;
    message: string;
    category: string;
    timestamp: string;
    link: string;
  }) {
    if (this.server) {
      this.server.emit('campus_notification', notification);
      this.logger.log(`Broadcasted notification: ${notification.title}`);
    }
  }

  /**
   * Send notification targeting specific role (e.g. STUDENT, LECTURER, BAAK)
   */
  notifyRole(role: string, payload: any) {
    if (this.server) {
      this.server.to(`role:${role}`).emit('role_notification', payload);
    }
  }
}

