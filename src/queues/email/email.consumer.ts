import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QUEUE_NAMES } from "../queues.module";
import { Job } from "bullmq";
import { EmailService } from "@/shared/email/email.service";
import { Injectable } from "@nestjs/common";
@Injectable()
@Processor(QUEUE_NAMES.EMAIL)
export class EmailConsumer extends WorkerHost{
    constructor(private emailService:EmailService){
        super();
    }
    async process(job: Job) {
        switch(job.name){
            case 'welcome-email':
                await this.emailService.sendEmail(
                    job.data.to,
                    'Welcome to AI CRM!',
                    `<h1>Welcome ${job.data.firstName}!</h1>
                    <p>Thanks for joining. Start managing your leads today.</p>`
                );
            break;
            case 'notification-email':
                await this.emailService.sendEmail(
                    job.data.to,
                    job.data.subject,
                    job.data.html
                );
            break;
        }
    }
   
}