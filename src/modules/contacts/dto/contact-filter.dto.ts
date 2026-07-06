import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ContactFilterDto{
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    search?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyId?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    country?:string;
    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    @IsString({each:true})
    tags?:string[];
    @ApiPropertyOptional()
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    page?:number;
    @ApiPropertyOptional()
    @Type   (()=>Number)
    @IsInt()
    @Max(100)
    @IsOptional()
    @Min(1)
    limit?:number;
}