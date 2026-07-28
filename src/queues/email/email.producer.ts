import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { QUEUE_NAMES } from "../queues.module";
import { Queue } from "bullmq";

@Injectable()
export class EmailProducer{
    constructor(@InjectQueue(QUEUE_NAMES.EMAIL)private emailQueue:Queue){}
    async sendWelcomeEmail(to:string,firstName:string){
        await this.emailQueue.add('welcome-email',{to,firstName});
    }
    async sendNotificationEmail(to:string,subject:string,html:string){
        await this.emailQueue.add('notification-email',{to,subject,html});
    }
}