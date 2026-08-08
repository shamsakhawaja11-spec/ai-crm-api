import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { QueuesModule } from '@/queues/queues.module';

import { RealtimeModule } from '@/shared/real-time/realtime.module';

import { NotificationsController } from './notifications.controller';

import { NotificationsService } from './notifications.service';

import { NotificationProcessorService } from './notification-processor.service';

@Module({
  imports: [
    DatabaseModule,
    QueuesModule,
    RealtimeModule,
  ],

  controllers: [
    NotificationsController,
  ],

  providers: [
    NotificationsService,
    NotificationProcessorService,
  ],

  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}