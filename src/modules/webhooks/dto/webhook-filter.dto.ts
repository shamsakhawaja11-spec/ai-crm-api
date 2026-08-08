import {
  IsBooleanString,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class WebhookFilterDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}