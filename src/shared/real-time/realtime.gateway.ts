import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import {
  Logger,
  UseGuards,
} from '@nestjs/common';

import {
  Server,
  Socket,
} from 'socket.io';

import { PrismaService } from '@/database/prisma.service';

import { WebsocketAuthGuard } from './guards/websocket-auth.guard';

import { RealtimeService } from './realtime.service';

import { RealtimeEvent } from './realtime.types';

@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
@UseGuards(WebsocketAuthGuard)
export class RealtimeGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  private readonly logger =
    new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly prisma: PrismaService,
  ) {}

  afterInit(server: Server): void {
    this.realtimeService.setServer(server);

    this.logger.log(
      'Realtime WebSocket gateway initialized',
    );
  }

  async handleConnection(
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const user = socket.data.user;

      if (!user) {
        socket.disconnect(true);
        return;
      }

      await socket.join(
        this.realtimeService.getUserRoom(user.id),
      );

      const membership =
        await this.prisma.teamMember.findFirst({
          where: {
            userId: user.id,
          },
          select: {
            teamId: true,
          },
        });

      if (membership) {
        socket.data.teamId = membership.teamId;

        await socket.join(
          this.realtimeService.getWorkspaceRoom(
            membership.teamId,
          ),
        );
      }

      socket.emit(
        RealtimeEvent.CONNECTED,
        {
          event: RealtimeEvent.CONNECTED,
          data: {
            userId: user.id,
          },
          timestamp: new Date().toISOString(),
        },
      );

      this.logger.log(
        `Socket connected: ${socket.id}, user=${user.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Socket connection setup failed: ${socket.id}`,
        error,
      );

      socket.disconnect(true);
    }
  }

  handleDisconnect(
    @ConnectedSocket() socket: Socket,
  ): void {
    this.logger.log(
      `Socket disconnected: ${socket.id}`,
    );
  }
}