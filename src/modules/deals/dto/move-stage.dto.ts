import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MoveStageDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    stageId!:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lostReason?:string;
}