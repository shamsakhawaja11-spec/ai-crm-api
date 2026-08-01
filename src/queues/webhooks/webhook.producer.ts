import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { QUEUE_NAMES } from "../queues.module";
import { Queue } from "bullmq";

@Injectable()
export class WebhooksProducer{
    constructor(@InjectQueue(QUEUE_NAMES.WEBHOOK)private webhook:Queue){}
    async deliverWebhook(webhookId:string,event:string,payload:Record<string,any>){
        await this.webhook.add('webhook',{webhookId,event,payload});
    }
} 