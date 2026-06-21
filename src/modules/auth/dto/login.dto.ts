import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength,Matches } from "class-validator";

export class LoginDto{
    @IsString()
    @IsEmail({},{message:'Email must be valid'})
    @Transform(({value})=>value?.toLowercase().trim())
    email!:string;
    @IsString()
    @MinLength(8,{message:'password must be greater then 8'})
    @MaxLength(32,{message:'password must be less then 32'})
    password!:string;
}