import { InjectQueue } from '@nestjs/bullmq';

import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { WebhookEvent } from '@prisma/client';

import { QUEUE_NAMES } from '../queues.module';

export interface WebhookJobData {
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
}

@Injectable()
export class WebhooksProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.WEBHOOK)
    private readonly webhookQueue: Queue,
  ) {}

  async deliverWebhook(
    webhookId: string,
    event: WebhookEvent,
    payload: Record<string, unknown>,
  ): Promise<void> {
    await this.webhookQueue.add(
      'webhook',
      {
        webhookId,
        event,
        payload,
      },
      {
        attempts: 5,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: {
          age: 86400,
          count: 1000,
        },

        removeOnFail: {
          age: 604800,
          count: 5000,
        },
      },
    );
  }
}