import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError,timeout } from "rxjs/operators";
@Injectable()
export class TimeoutInterceptor implements NestInterceptor{
    private readonly requestTimeout=30000;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(this.requestTimeout),
            catchError((error:any)=>{
                if(error instanceof TimeoutError){
                    return throwError(()=>new RequestTimeoutException('Request Time-out'));
                }
                return throwError(()=>error);
            }),
        );
    }
}