import { Module } from '@nestjs/common';

import { QueuesModule } from '@/queues/queues.module';

import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  imports: [
    QueuesModule,
  ],
  controllers: [
    EmailsController,
  ],
  providers: [
    EmailsService,
  ],
})
export class EmailsModule {}