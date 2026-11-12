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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string) ||
        (authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null);

      if (token) {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('jwt.secret'),
        });
        client.data.user = payload;
        this.logger.log(`Authenticated client connected: ${client.id} (user: ${payload.username})`);
        return;
      }
    } catch (err) {
      this.logger.warn(`Unauthenticated connection attempt: ${client.id}`);
    }
    this.logger.log(`Guest client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_role_room')
  handleJoinRoleRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() role: string,
  ) {
    const user = client.data?.user;
    if (!user || (!user.roles?.includes(role) && !user.roles?.includes('SUPER_ADMIN'))) {
      this.logger.warn(`Unauthorized join_role_room attempt: client ${client.id} tried to join role:${role}`);
      return { status: 'error', message: 'Akses ke room ditolak: role tidak sesuai otorisasi token' };
    }

    const roomName = `role:${role}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} (${user.username}) joined ${roomName}`);
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

