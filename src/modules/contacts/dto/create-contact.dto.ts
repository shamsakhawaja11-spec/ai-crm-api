import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateContactDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName!:string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName!:string;
    @IsEmail()
    @ApiPropertyOptional()
    @IsOptional()
    email?:string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phone?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    jobTitle?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    department?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    linkedinUrl?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    twitterUrl?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    country?:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?:string;
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags?:string[];
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    companyId?:string;


}