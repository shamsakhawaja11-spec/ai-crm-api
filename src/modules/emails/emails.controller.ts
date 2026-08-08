import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { EmailsService } from './emails.service';

import { SendEmailDto } from './dto/send-email.dto';

@Controller('emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
  ) {}

  @Post('send')
  async sendEmail(
    @Body() dto: SendEmailDto,
  ) {
    return this.emailsService.sendEmail(dto);
  }
}