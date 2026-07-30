import { InjectQueue } from "@nestjs/bullmq";
import { QUEUE_NAMES } from "../queues.module";
import { Queue } from "bullmq";
import { Injectable } from "@nestjs/common";
@Injectable()
export class AiProducer{
    constructor(@InjectQueue(QUEUE_NAMES.AI)private queue:Queue){}

    async scoreLead(leadId:string){
        await this.queue.add('score-lead',{leadId});
    }
    async generateEmbedding(entityType:string,entityId:string,content:string){
        await this.queue.add('generate-embedding',{entityType,entityId,content});
    }


}