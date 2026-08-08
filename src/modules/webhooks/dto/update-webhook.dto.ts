import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUrl,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

import { WebhookEvent } from '@prisma/client';

export class UpdateWebhookDto {
  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  url?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsEnum(WebhookEvent, { each: true })
  events?: WebhookEvent[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}