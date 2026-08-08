import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import { Socket } from 'socket.io';

import { PrismaService } from '@/database/prisma.service';

import { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';

@Injectable()
export class WebsocketAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client =
      context.switchToWs().getClient<Socket>();

    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException(
        'Authentication token is required',
      );
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(
          token,
          {
            secret:
              this.configService.get<string>(
                'jwt.accessSecret',
              ),
            issuer: 'ai-crm',
            audience: 'ai-crm-client',
          },
        );

      if (payload.type !== 'access') {
        throw new UnauthorizedException(
          'Invalid token type',
        );
      }

      const user =
        await this.prisma.user.findUnique({
          where: {
            id: payload.sub,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
          },
        });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'User not found or deactivated',
        );
      }

      client.data.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired access token',
      );
    }
  }

  private extractToken(
    client: Socket,
  ): string | null {
    const authToken = client.handshake.auth?.token;

    if (typeof authToken === 'string') {
      return authToken.startsWith('Bearer ')
        ? authToken.substring(7)
        : authToken;
    }

    const authorization =
      client.handshake.headers.authorization;

    if (
      typeof authorization === 'string' &&
      authorization.startsWith('Bearer ')
    ) {
      return authorization.substring(7);
    }

    return null;
  }
}