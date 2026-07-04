import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
export class InviteMembersDto{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example:'shamsakhawaja11@gmail.com'})
    email!:string;
    @ApiProperty({example:'OWNER'})
    @IsEnum(UserRole)
    role!:UserRole;
}