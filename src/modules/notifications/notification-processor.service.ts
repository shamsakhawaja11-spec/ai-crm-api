import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

import { RealtimeService } from '@/shared/real-time/realtime.service';

import { RealtimeEvent } from '@/shared/real-time/realtime.types';

@Injectable()
export class NotificationProcessorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async processNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, any>;
  }) {
    const notification =
      await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          body: data.body,
          metadata: data.metadata,
        },
      });

    this.realtimeService.emitToUser(
      data.userId,
      RealtimeEvent.NOTIFICATION_CREATED,
      notification,
    );

    return notification;
  }
}