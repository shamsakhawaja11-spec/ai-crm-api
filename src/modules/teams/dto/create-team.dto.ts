import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class CreateTeamDto{
    @IsString()
    @IsNotEmpty() 
    @ApiProperty({example:'sales team'})   
    name!:string;
    @ApiProperty({example:'sales-team'})
    @IsNotEmpty()
    @Matches(/^[a-z0-9-]+$/)
    @IsString()
    slug!:string;
    @ApiPropertyOptional({example:'sales-team.jpg'})
    @IsOptional()
    @IsUrl()
    logoUrl?:string;
    @IsOptional()
    @ApiPropertyOptional({example:'the team leader is shamsa'})
    description?:string;
}