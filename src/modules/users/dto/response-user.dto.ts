import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class ResponseUserDto{
    @ApiProperty({example:'1234-kid663-1993e'})
    id!:string;
    @ApiProperty({example:'shamsakhawaja11@gmail.com'})
    email!:string;
    @ApiProperty({example:'Shamsa'})
    firstName!:string;
    @ApiProperty({example:'Noor'})
    lastName!:string;
    @ApiProperty({example:'+923325005586',nullable:true})
    phone!:string;
    @ApiProperty({example:'http://me.com',nullable:true})
    avatarUrl!:string;
    @ApiProperty({example:'Asis/Islamabad'})
    timezone!:string;
    @ApiProperty({example:true})
    isEmailVerified!:boolean;
    @ApiProperty({example:true})
    isActive!:boolean;
    @ApiProperty({example:'12-3-2026',nullable:true})
    lastLoginAt!:Date|null;
    @ApiProperty({example:'1-2-2026'})
    createdAt!:Date;
    @ApiProperty({example:'3-3-2026'})
    updatedAt!:Date;
    @ApiProperty({enum:UserRole})
    role!:UserRole;
}