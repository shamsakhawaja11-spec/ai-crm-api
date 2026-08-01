import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../queues.module";
import { Injectable } from "@nestjs/common";
@Injectable()
export class NotificationProducer{
    constructor(@InjectQueue(QUEUE_NAMES.NOTIFICATION)private notificationQueue:Queue){}

    async sendNotification(userId:string,type:string,title:string,body:string,metadata?:Record<string,any>){
        await this.notificationQueue.add('notification',{userId,type,title,body,metadata});
    }
}