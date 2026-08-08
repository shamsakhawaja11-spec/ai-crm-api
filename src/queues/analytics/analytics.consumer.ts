import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import {
  Job,
} from 'bullmq';

import {
  Logger,
} from '@nestjs/common';

import {
  QUEUE_NAMES,
} from '../queues.module';

import {
  PrismaService,
} from '../../database/prisma.service';

import {
  AnalyticsJobData,
  AnalyticsJobName,
  DealWonJob,
  LeadConvertedJob,
} from './analytics.types';

@Processor(QUEUE_NAMES.ANALYTICS, {
  concurrency: 5,
})
export class AnalyticsConsumer extends WorkerHost {
  private readonly logger = new Logger(AnalyticsConsumer.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(
    job: Job<AnalyticsJobData>,
  ): Promise<void> {
    this.logger.debug(
      `Processing analytics job ${job.id} (${job.name})`,
    );

    switch (job.name) {
      case AnalyticsJobName.DEAL_WON:
        await this.handleDealWon(
          job as Job<DealWonJob>,
        );
        return;

      case AnalyticsJobName.LEAD_CONVERTED:
        await this.handleLeadConverted(
          job as Job<LeadConvertedJob>,
        );
        return;

      default:
        this.logger.error(
          `Unknown analytics job: ${job.name}`,
        );

        throw new Error(
          `Unsupported analytics job: ${job.name}`,
        );
    }
  }

  private async handleDealWon(
    job: Job<DealWonJob>,
  ): Promise<void> {
    const { teamId, dealId } = job.data;

    const deal = await this.prisma.deal.findFirst({
      where: {
        id: dealId,
        teamId,
      },
      select: {
        id: true,
        value: true,
        closedAt: true,
        stage: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!deal) {
      throw new Error(
        `Deal ${dealId} not found for team ${teamId}`,
      );
    }

    if (!deal.closedAt) {
      throw new Error(
        `Deal ${dealId} has no closedAt date`,
      );
    }

    const date = this.startOfDay(deal.closedAt);

    await this.prisma.analyticsDaily.upsert({
      where: {
        teamId_date: {
          teamId,
          date,
        },
      },

      create: {
        teamId,
        date,
        wonDeals: 1,
        wonRevenue: deal.value,
      },

      update: {
        wonDeals: {
          increment: 1,
        },
        wonRevenue: {
          increment: deal.value,
        },
      },
    });

    this.logger.log(
      `Updated deal-won analytics for team ${teamId}, deal ${dealId}`,
    );
  }

  private async handleLeadConverted(
    job: Job<LeadConvertedJob>,
  ): Promise<void> {
    const { teamId, leadId } = job.data;

    const lead = await this.prisma.lead.findFirst({
      where: {
        id: leadId,
        teamId,
      },
      select: {
        id: true,
        convertedAt: true,
      },
    });

    if (!lead) {
      throw new Error(
        `Lead ${leadId} not found for team ${teamId}`,
      );
    }

    if (!lead.convertedAt) {
      throw new Error(
        `Lead ${leadId} has no convertedAt date`,
      );
    }

    const date = this.startOfDay(lead.convertedAt);

    await this.prisma.analyticsDaily.upsert({
      where: {
        teamId_date: {
          teamId,
          date,
        },
      },

      create: {
        teamId,
        date,
        convertedLeads: 1,
      },

      update: {
        convertedLeads: {
          increment: 1,
        },
      },
    });

    this.logger.log(
      `Updated lead-conversion analytics for team ${teamId}, lead ${leadId}`,
    );
  }

  private startOfDay(date: Date): Date {
    const result = new Date(date);

    result.setUTCHours(
      0,
      0,
      0,
      0,
    );

    return result;
  }
}