import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { QUEUE_NAMES } from "../queues.module";
import { Job } from "bullmq";

@Injectable()
@Processor(QUEUE_NAMES.WEBHOOK)
export class WebhookConsumer extends WorkerHost{
    constructor(){
        super();
    }
    async process(job: Job, token?: string) {
        console.log('Webhook');
    }
}