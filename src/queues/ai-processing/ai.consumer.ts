import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { QUEUE_NAMES } from "../queues.module";
@Injectable()
@Processor(QUEUE_NAMES.AI)
export class AiConsumer extends WorkerHost{
    constructor(){
        super();
    }

    async process(job: Job, token?: string): Promise<any> {
        switch(job.name){
            case 'score-lead':
                console.log('score lead');
            break;
            case 'generate-embedding':
                console.log('embeddings')
            break;
        }
    }
}