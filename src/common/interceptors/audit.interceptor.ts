import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
//import { PrismaService } from '../../database/prisma.service';

const MUTATING_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
 // constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') ?? 'unknown';

    if (!MUTATING_METHODS.includes(method)) {
      return next.handle();
    }

    const user = (request as any).user;

    if (!user?.id || !user?.teamId) {
      return next.handle();
    }

    const entityType = this.extractEntityType(url);
    const entityId = this.extractEntityId(url);

    return next.handle().pipe(
      tap({
        next: (responseData) => {
        //   this.prisma.auditLog
        //     .create({
        //       data: {
        //         teamId: user.teamId,
        //         userId: user.id,
        //         action: `${entityType}.${method.toLowerCase()}`,
        //         entityType,
        //         entityId: entityId ?? responseData?.data?.id ?? 'unknown',
        //         after: responseData?.data ?? null,
        //         ipAddress: ip,
        //         userAgent,
        //       },
        //     })
        //     .catch(() => null);
        },
      }),
    );
  }

  private extractEntityType(url: string): string {
    const parts = url.split('/').filter(Boolean);
    const versionIndex = parts.findIndex((p) => p.startsWith('v'));
    return parts[versionIndex + 1] ?? 'unknown';
  }

  private extractEntityId(url: string): string | null {
    const parts = url.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    return last && !last.startsWith('v') && isNaN(Number(last)) ? last : null;
  }
}