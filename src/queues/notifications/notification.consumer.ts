import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { QUEUE_NAMES } from "../queues.module";
@Injectable()
@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationConsumer extends WorkerHost{
    constructor(){
        super();
    }
    async process(job: Job, token?: string): Promise<any> {
        console.log('Notification Consumer');
    }
}