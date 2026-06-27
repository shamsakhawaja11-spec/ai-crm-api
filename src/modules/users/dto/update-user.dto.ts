import { ApiPropertyOptional } from "@nestjs/swagger";
import {  IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateUserDto{
    @ApiPropertyOptional({example:'+923325005586'})
    @IsString()
    @IsOptional()
    @MaxLength(11,{message:'phone number must be less then 11'})
    phone?:string;
    @ApiPropertyOptional({example:'Noor'})
    @IsOptional()
    @IsString()
    @MaxLength(50,{message:'last name must be less then 50'})
    lastName?:string;
    @ApiPropertyOptional({example:'Shamsa'})
    @IsOptional()
    @IsString()
    @MaxLength(30,{message:'first name must be less then 30'})
    firstName?:string;
    @ApiPropertyOptional({example:'http://me.com'})
    @IsOptional()
    @IsUrl()
    avatarUrl?:string;
    @ApiPropertyOptional({example:'Asia/islamabad'})
    @IsString()
    @IsOptional()
    timezone?:string;
}