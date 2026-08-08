import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { NotificationFilterDto } from './dto/notification-filter.dto';

import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService:
      NotificationsService,
  ) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() dto: NotificationFilterDto,
  ) {
    return this.notificationsService.findAll(
      userId,
      dto,
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAsRead(
      notificationId,
      userId,
    );
  }

  @Patch(':id/unread')
  async markAsUnread(
    @Param('id') notificationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAsUnread(
      notificationId,
      userId,
    );
  }

  @Patch('read-all')
  async markAllAsRead(
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAllAsRead(
      userId,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') notificationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.remove(
      notificationId,
      userId,
    );
  }
}