import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CurrentUser,
} from '@/common/decorators/current-user.decorator';

import {
  CreateWebhookDto,
} from './dto/create-webhook.dto';

import {
  UpdateWebhookDto,
} from './dto/update-webhook.dto';

import {
  WebhookFilterDto,
} from './dto/webhook-filter.dto';

import {
  WebhooksService,
} from './webhooks.service';

@Controller('teams/:teamId/webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService:
      WebhooksService,
  ) {}

  @Post()
  create(
    @Param('teamId') teamId: string,

    @CurrentUser('id')
    userId: string,

    @Body()
    dto: CreateWebhookDto,
  ) {
    return this.webhooksService.create(
      teamId,
      userId,
      dto,
    );
  }

  @Get()
  findAll(
    @Param('teamId') teamId: string,

    @CurrentUser('id')
    userId: string,

    @Query()
    dto: WebhookFilterDto,
  ) {
    return this.webhooksService.findAll(
      teamId,
      userId,
      dto,
    );
  }

  @Get(':id')
  findOne(
    @Param('teamId') teamId: string,

    @Param('id') webhookId: string,

    @CurrentUser('id')
    userId: string,
  ) {
    return this.webhooksService.findOne(
      teamId,
      userId,
      webhookId,
    );
  }

  @Patch(':id')
  update(
    @Param('teamId') teamId: string,

    @Param('id') webhookId: string,

    @CurrentUser('id')
    userId: string,

    @Body()
    dto: UpdateWebhookDto,
  ) {
    return this.webhooksService.update(
      teamId,
      userId,
      webhookId,
      dto,
    );
  }

  @Post(':id/rotate-secret')
  rotateSecret(
    @Param('teamId') teamId: string,

    @Param('id') webhookId: string,

    @CurrentUser('id')
    userId: string,
  ) {
    return this.webhooksService.rotateSecret(
      teamId,
      userId,
      webhookId,
    );
  }

  @Get(':id/deliveries')
  listDeliveries(
    @Param('teamId') teamId: string,

    @Param('id') webhookId: string,

    @CurrentUser('id')
    userId: string,
  ) {
    return this.webhooksService.listDeliveries(
      teamId,
      userId,
      webhookId,
    );
  }

  @Delete(':id')
  remove(
    @Param('teamId') teamId: string,

    @Param('id') webhookId: string,

    @CurrentUser('id')
    userId: string,
  ) {
    return this.webhooksService.remove(
      teamId,
      userId,
      webhookId,
    );
  }
}