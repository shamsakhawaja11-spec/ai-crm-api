import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import {Response, Request} from 'express'
import { string } from "joi";
import { timestamp } from "rxjs";
export class HttpExceptionFilter implements ExceptionFilter{
    private readonly logger=new Logger(HttpExceptionFilter.name);
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx=host.switchToHttp();
        const response=ctx.getResponse<Response>();
        const request=ctx.getRequest<Request>();

        const status=exception instanceof HttpException?
        exception.getStatus():HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse=exception instanceof HttpException?
        exception.getResponse():null;

        const message=typeof exceptionResponse==='object'&&exceptionResponse!=null?
        (exceptionResponse as any).message??'internal server error':exceptionResponse??'internal server error';

        const errorResponse={
            success:false,
            statusCode:status,
            path:request.url,
            timestamp:new Date().toISOString(),
            message:Array.isArray(message)?message:[message],
        };

        if(status==HttpStatus.INTERNAL_SERVER_ERROR){
            this.logger.error(
                `${request.method}${request.url}`,exception instanceof Error?exception.stack:String(exception),
            );
        }else{
            this.logger.warn(`${request.method}${request.url}-${status}`);
        }
        response.status(status).json(errorResponse);
    }
    
}