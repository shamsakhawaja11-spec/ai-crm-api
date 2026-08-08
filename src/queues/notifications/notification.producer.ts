import { InjectQueue } from '@nestjs/bullmq';

import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { NotificationType } from '@prisma/client';

import { QUEUE_NAMES } from '../queues.module';

@Injectable()
export class NotificationProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.NOTIFICATION)
    private readonly notificationQueue: Queue,
  ) {}

  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.notificationQueue.add(
      'notification',
      {
        userId,
        type,
        title,
        body,
        metadata,
      },
    );
  }
}