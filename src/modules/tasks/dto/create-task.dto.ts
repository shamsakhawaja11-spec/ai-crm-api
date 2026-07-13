import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: 'Follow up with Ahmed' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Call him about the proposal' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: '2026-08-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dealId?: string;
}