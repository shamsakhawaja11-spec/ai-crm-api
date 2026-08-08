import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import {
  PrismaService,
} from '@/database/prisma.service';

import {
  WebhookEvent,
} from '@prisma/client';

import { randomBytes } from 'crypto';

import { CreateWebhookDto } from './dto/create-webhook.dto';

import { UpdateWebhookDto } from './dto/update-webhook.dto';

import { WebhookFilterDto } from './dto/webhook-filter.dto';

import { WebhooksProducer } from '@/queues/webhooks/webhook.producer';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly webhooksProducer: WebhooksProducer,
  ) {}

  private async verifyTeamMembership(
    teamId: string,
    userId: string,
  ) {
    const membership =
      await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
        select: {
          id: true,
          role: true,
        },
      });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this team',
      );
    }

    return membership;
  }

  async create(
    teamId: string,
    userId: string,
    dto: CreateWebhookDto,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const secret =
      `whsec_${randomBytes(32).toString('hex')}`;

    const webhook =
      await this.prisma.webhook.create({
        data: {
          teamId,
          url: dto.url,
          events: dto.events,
          secret,
        },
        select: {
          id: true,
          teamId: true,
          url: true,
          events: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return {
      ...webhook,

      // Return secret ONLY when creating.
      secret,
    };
  }

  async findAll(
    teamId: string,
    userId: string,
    dto: WebhookFilterDto,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const skip = (page - 1) * limit;

    const where = {
      teamId,

      ...(dto.active === 'true'
        ? { isActive: true }
        : {}),

      ...(dto.active === 'false'
        ? { isActive: false }
        : {}),
    };

    const [
      webhooks,
      total,
    ] = await Promise.all([
      this.prisma.webhook.findMany({
        where,
        skip,
        take: limit,

        select: {
          id: true,
          teamId: true,
          url: true,
          events: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.webhook.count({
        where,
      }),
    ]);

    return {
      data: webhooks,

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  async findOne(
    teamId: string,
    userId: string,
    webhookId: string,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const webhook =
      await this.prisma.webhook.findFirst({
        where: {
          id: webhookId,
          teamId,
        },

        select: {
          id: true,
          teamId: true,
          url: true,
          events: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!webhook) {
      throw new NotFoundException(
        'Webhook not found',
      );
    }

    return webhook;
  }

  async update(
    teamId: string,
    userId: string,
    webhookId: string,
    dto: UpdateWebhookDto,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const existing =
      await this.prisma.webhook.findFirst({
        where: {
          id: webhookId,
          teamId,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        'Webhook not found',
      );
    }

    return this.prisma.webhook.update({
      where: {
        id: webhookId,
      },

      data: {
        ...(dto.url !== undefined && {
          url: dto.url,
        }),

        ...(dto.events !== undefined && {
          events: dto.events,
        }),

        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },

      select: {
        id: true,
        teamId: true,
        url: true,
        events: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async rotateSecret(
    teamId: string,
    userId: string,
    webhookId: string,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const existing =
      await this.prisma.webhook.findFirst({
        where: {
          id: webhookId,
          teamId,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        'Webhook not found',
      );
    }

    const secret =
      `whsec_${randomBytes(32).toString('hex')}`;

    await this.prisma.webhook.update({
      where: {
        id: webhookId,
      },

      data: {
        secret,
      },
    });

    return {
      webhookId,
      secret,
    };
  }

  async remove(
    teamId: string,
    userId: string,
    webhookId: string,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const existing =
      await this.prisma.webhook.findFirst({
        where: {
          id: webhookId,
          teamId,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        'Webhook not found',
      );
    }

    await this.prisma.webhook.delete({
      where: {
        id: webhookId,
      },
    });

    return {
      deleted: true,
    };
  }

  async listDeliveries(
    teamId: string,
    userId: string,
    webhookId: string,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const webhook =
      await this.prisma.webhook.findFirst({
        where: {
          id: webhookId,
          teamId,
        },
        select: {
          id: true,
        },
      });

    if (!webhook) {
      throw new NotFoundException(
        'Webhook not found',
      );
    }

    return this.prisma.webhookDelivery.findMany({
      where: {
        webhookId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 100,
    });
  }

  async dispatchEvent(
    teamId: string,
    event: WebhookEvent,
    payload: Record<string, unknown>,
  ) {
    const webhooks =
      await this.prisma.webhook.findMany({
        where: {
          teamId,
          isActive: true,
          events: {
            has: event,
          },
        },

        select: {
          id: true,
        },
      });

    await Promise.all(
      webhooks.map((webhook) =>
        this.webhooksProducer.deliverWebhook(
          webhook.id,
          event,
          payload,
        ),
      ),
    );

    return {
      queued: webhooks.length,
    };
  }
}