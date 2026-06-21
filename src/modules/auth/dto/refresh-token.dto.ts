import {ApiProperty} from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator';
export class RefreshTokenDto{
    @ApiProperty({
        description:'opaque resfrsh token issued at login and register',
        example:'a23hdu822....',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken!:string;
}