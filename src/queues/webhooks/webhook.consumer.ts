import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { Job } from 'bullmq';

import { QUEUE_NAMES } from '../queues.module';

import { PrismaService } from '@/database/prisma.service';

@Injectable()
@Processor(QUEUE_NAMES.WEBHOOK)
export class WebhookConsumer extends WorkerHost {
  private readonly logger =
    new Logger(WebhookConsumer.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(
    job: Job,
    token?: string,
  ): Promise<void> {
    const {
      webhookId,
      event,
      payload,
    } = job.data;

    this.logger.log(
      `Processing webhook ${webhookId} for event ${event}`,
    );

    const delivery =
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId,
          event,
          payload: JSON.parse(
            JSON.stringify(payload),
          ),
          attempts:
            job.attemptsMade + 1,
        },
      });

    this.logger.log(
      `Webhook delivery created: ${delivery.id}`,
    );

    // Actual HTTP delivery will be implemented
    // in the webhook delivery layer.
  }
}