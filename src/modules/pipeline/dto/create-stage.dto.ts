import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsHexColor, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateStageDto {
  @ApiProperty({ example: 'Prospecting' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  order!: number;

  @ApiPropertyOptional({ example: '#6366f1' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ example: 'clx123pipeline' })
  @IsString()
  @IsNotEmpty()
  pipelineId!: string;
}