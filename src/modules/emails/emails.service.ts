import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EmailProducer } from '@/queues/email/email.producer';

import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailsService {
  constructor(
    private readonly emailProducer: EmailProducer,
  ) {}

  async sendEmail(
    dto: SendEmailDto,
  ): Promise<{
    queued: boolean;
  }> {
    await this.emailProducer.sendNotificationEmail(
      dto.to,
      dto.subject,
      dto.html,
    );

    return {
      queued: true,
    };
  }

  async sendWelcomeEmail(
    to: string,
    firstName: string,
  ): Promise<{
    queued: boolean;
  }> {
    await this.emailProducer.sendWelcomeEmail(
      to,
      firstName,
    );

    return {
      queued: true,
    };
  }
}