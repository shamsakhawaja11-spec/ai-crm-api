import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { NotificationProducer } from '@/queues/notifications/notification.producer';

import { NotificationFilterDto } from './dto/notification-filter.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationProducer: NotificationProducer,
  ) {}

  async findAll(
    userId: string,
    dto: NotificationFilterDto,
  ) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const skip = (page - 1) * limit;

    const where = {
      userId,

      ...(dto.unread === 'true'
        ? { isRead: false }
        : {}),

      ...(dto.unread === 'false'
        ? { isRead: true }
        : {}),
    };

    const [
      notifications,
      total,
      unreadCount,
    ] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.notification.count({
        where,
      }),

      this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ]);

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        unreadCount,
      },
    };
  }

  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ) {
    await this.notificationProducer.sendNotification(
      userId,
      type,
      title,
      body,
      metadata,
    );

    return {
      queued: true,
    };
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    if (notification.isRead) {
      return notification;
    }

    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAsUnread(
    notificationId: string,
    userId: string,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: false,
        readAt: null,
      },
    });
  }

  async markAllAsRead(userId: string) {
    const result =
      await this.prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

    return {
      updated: result.count,
    };
  }

  async remove(
    notificationId: string,
    userId: string,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    await this.prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return {
      deleted: true,
    };
  }
}