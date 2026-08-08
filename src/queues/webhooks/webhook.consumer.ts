import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { Job } from 'bullmq';

import {
  createHmac,
} from 'crypto';

import {
  PrismaService,
} from '@/database/prisma.service';

import {
  QUEUE_NAMES,
} from '../queues.module';

import {
  WebhookJobData,
} from './webhook.producer';

@Injectable()
@Processor(QUEUE_NAMES.WEBHOOK)
export class WebhookConsumer
  extends WorkerHost {

  private readonly logger =
    new Logger(WebhookConsumer.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(
    job: Job<WebhookJobData>,
  ): Promise<void> {

    const {
      webhookId,
      event,
      payload,
    } = job.data;

    const webhook =
      await this.prisma.webhook.findUnique({
        where: {
          id: webhookId,
        },
      });

    if (!webhook) {
      this.logger.warn(
        `Webhook ${webhookId} no longer exists`,
      );

      return;
    }

    if (!webhook.isActive) {
      this.logger.debug(
        `Webhook ${webhookId} is inactive`,
      );

      return;
    }

    const delivery =
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId,
          event,
          payload,
          attempts: job.attemptsMade + 1,
        },
      });

    const body =
      JSON.stringify(payload);

    const timestamp =
      Math.floor(Date.now() / 1000);

    const signature =
      createHmac(
        'sha256',
        webhook.secret,
      )
        .update(
          `${timestamp}.${body}`,
        )
        .digest('hex');

    try {

      const controller =
        new AbortController();

      const timeout =
        setTimeout(
          () => controller.abort(),
          10_000,
        );

      let response: Response;

      try {

        response = await fetch(
          webhook.url,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'User-Agent':
                'AI-CRM-Webhooks/1.0',

              'X-Webhook-Event':
                event,

              'X-Webhook-Delivery':
                delivery.id,

              'X-Webhook-Timestamp':
                timestamp.toString(),

              'X-Webhook-Signature':
                `sha256=${signature}`,
            },

            body,

            signal:
              controller.signal,
          },
        );

      } finally {
        clearTimeout(timeout);
      }

      const responseBody =
        await response.text();

      await this.prisma.webhookDelivery.update({
        where: {
          id: delivery.id,
        },

        data: {
          statusCode:
            response.status,

          response:
            responseBody.slice(0, 10_000),

          deliveredAt:
            response.ok
              ? new Date()
              : null,

          attempts:
            job.attemptsMade + 1,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Webhook returned HTTP ${response.status}`,
        );
      }

      this.logger.log(
        `Webhook ${webhookId} delivered successfully`,
      );

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : 'Unknown webhook error';

      await this.prisma.webhookDelivery.update({
        where: {
          id: delivery.id,
        },

        data: {
          response:
            message.slice(0, 10_000),

          attempts:
            job.attemptsMade + 1,
        },
      });

      this.logger.error(
        `Webhook ${webhookId} delivery failed: ${message}`,
      );

      throw error;
    }
  }
}