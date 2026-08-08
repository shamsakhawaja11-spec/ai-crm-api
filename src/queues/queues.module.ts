import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { EmailProducer } from './email/email.producer';
import { EmailConsumer } from './email/email.consumer';
export const QUEUE_NAMES = {
  EMAIL: 'email',
  AI: 'ai-processing',
  NOTIFICATION: 'notifications',
  WEBHOOK: 'webhooks',
  ANALYTICS: 'analytics',
};

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.EMAIL },
      { name: QUEUE_NAMES.AI },
      { name: QUEUE_NAMES.NOTIFICATION },
      { name: QUEUE_NAMES.WEBHOOK },
      { name: QUEUE_NAMES.ANALYTICS },
    ),
  ],
   providers: [
    EmailProducer,
    EmailConsumer,
  ],

  exports: [BullModule,EmailProducer],
})
export class QueuesModule {}