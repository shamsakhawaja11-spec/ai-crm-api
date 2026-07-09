import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ConvertLeadDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pipelineId!: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    stageId!:string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dealTitle!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    dealValue?: number;
}