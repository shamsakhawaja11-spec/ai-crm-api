import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

import {
  RealtimeEvent,
  RealtimePayload,
} from './realtime.types';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  private server: Server | null = null;

  setServer(server: Server): void {
    this.server = server;
  }

  emitToUser<T>(
    userId: string,
    event: RealtimeEvent,
    data: T,
  ): void {
    if (!this.server) {
      this.logger.warn('Socket server is not initialized');
      return;
    }

    const payload: RealtimePayload<T> = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.server
      .to(this.getUserRoom(userId))
      .emit(event, payload);
  }

  emitToWorkspace<T>(
    workspaceId: string,
    event: RealtimeEvent,
    data: T,
  ): void {
    if (!this.server) {
      this.logger.warn('Socket server is not initialized');
      return;
    }

    const payload: RealtimePayload<T> = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.server
      .to(this.getWorkspaceRoom(workspaceId))
      .emit(event, payload);
  }

  getUserRoom(userId: string): string {
    return `user:${userId}`;
  }

  getWorkspaceRoom(workspaceId: string): string {
    return `workspace:${workspaceId}`;
  }
}