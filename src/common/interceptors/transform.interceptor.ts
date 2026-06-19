import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface ApiResponse<T> {
    success:boolean,
    statusCode:number,
    data:T,
    timestamp:string;
}
export class TransformInterceptor<T> implements NestInterceptor<T,ApiResponse<T>>{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ApiResponse<T>> {
        const response=context.switchToHttp().getResponse();
        return next.handle().pipe(
            map((data)=>({
            success:true,
            statusCode:response.getStatus(),
            data,
            timestamp:new Date().toISOString(),
            })));
        
    }
}