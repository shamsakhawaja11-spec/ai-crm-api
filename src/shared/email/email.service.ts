import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Resend} from 'resend';
@Injectable()

export class EmailService{
    private resend:Resend;
    constructor(private config:ConfigService){
        this.resend=new Resend(this.config.get<string>('resend.apiKey'));
    }
    async sendEmail(to:string,subject:string,html:string){
        const {data,error}=await this.resend.emails.send({
            from:this.config.get<string>('resend.from')??'onboarding@resend.dev',
            to:[to],
            subject:subject,
            html:html,
        });
        if(error){
            throw new Error(error.message);
        }
        return data;
    };
}