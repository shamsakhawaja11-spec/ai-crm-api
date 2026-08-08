import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QUEUE_NAMES } from '../queues.module';
import {
  AnalyticsJobName,
  DealWonJob,
  LeadConvertedJob,
} from './analytics.types';

@Injectable()
export class AnalyticsProducer {
  private readonly logger = new Logger(AnalyticsProducer.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.ANALYTICS)
    private readonly analyticsQueue: Queue,
  ) {}

  async dealWon(data: DealWonJob): Promise<void> {
    await this.analyticsQueue.add(
      AnalyticsJobName.DEAL_WON,
      data,
      {
        jobId: `deal-won:${data.dealId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 60 * 60 * 24,
          count: 1000,
        },
        removeOnFail: {
          age: 60 * 60 * 24 * 7,
        },
      },
    );

    this.logger.debug(
      `Analytics job queued: deal-won:${data.dealId}`,
    );
  }

  async leadConverted(data: LeadConvertedJob): Promise<void> {
    await this.analyticsQueue.add(
      AnalyticsJobName.LEAD_CONVERTED,
      data,
      {
        jobId: `lead-converted:${data.leadId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 60 * 60 * 24,
          count: 1000,
        },
        removeOnFail: {
          age: 60 * 60 * 24 * 7,
        },
      },
    );

    this.logger.debug(
      `Analytics job queued: lead-converted:${data.leadId}`,
    );
  }
}