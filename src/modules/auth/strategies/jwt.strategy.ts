import { ExtractJwt, Strategy } from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
export interface JwtPayload{
    sub:string;
    email:string;
    role:string;
    workspaceId:string;
    type:'access'|'refresh';
    iat?:number;
    exp?:number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(private configService:ConfigService,private prisma:PrismaService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.get<string>('jwt.accessSecret'),
            issuer:'ai-crm',
            audience:'ai-crm-client',
        });
    }
    async validate(payload:JwtPayload){
        if(payload.type!=='access'){
            throw new UnauthorizedException('invalid token type');
        }
       const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,          
                isActive: true,
                isEmailVerified: true,
            },
        });
        if(!user||!user?.isActive){
            throw new UnauthorizedException('user not found or deactivated');
        }
        return user;
    }
}