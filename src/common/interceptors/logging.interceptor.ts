import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import {tap} from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const startTime = Date.now();
    const userAgent = request.get('user-agent') ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;
          this.logger.log(
            `${method} ${url} ${response.statusCode} - ${duration}ms - ${ip} - ${userAgent}`,
          );
        },
        error: (error: any) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} ${error.status ?? 500} - ${duration}ms - ${ip} - ${userAgent}`,
          );
        },
      }),
    );
  }
}