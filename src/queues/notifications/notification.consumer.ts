import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import { Injectable } from '@nestjs/common';

import { Job } from 'bullmq';

import { QUEUE_NAMES } from '../queues.module';

import { NotificationProcessorService } from '@/modules/notifications/notification-processor.service';

@Injectable()
@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationConsumer extends WorkerHost {
  constructor(
    private readonly notificationProcessor:
      NotificationProcessorService,
  ) {
    super();
  }

  async process(
    job: Job,
  ): Promise<void> {
    switch (job.name) {
      case 'notification':
        await this.notificationProcessor.processNotification(
          job.data,
        );
        break;

      default:
        throw new Error(
          `Unknown notification job: ${job.name}`,
        );
    }
  }
}