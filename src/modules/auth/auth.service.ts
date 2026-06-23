import { PrismaService } from '@/database/prisma.service';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Validate user credentials (used by LocalStrategy) ───────────────────
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  // ─── Login: issue access + refresh tokens ────────────────────────────────
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  // ─── Generate short-lived JWT access token ───────────────────────────────
  private generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'), // e.g. '15m'
    });
  }
    private async generateRefreshToken(user: User): Promise<string> {
    const rawToken = randomBytes(64).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(
        expiresAt.getDate() +
        this.configService.get<number>('jwt.refreshExpiresInDays', 7),
    );

    await this.prisma.refreshToken.upsert({
        where: { userId: user.id },          // ✅ valid now — userId is @unique
        update: {
        token: hashedToken,
        expiresAt,
        revokedAt: null,                   // ✅ revokedAt not revoked
        },
        create: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
        },
    });

    return rawToken;
    }

    async refreshTokens(userId: string, rawToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
        where: { userId },                   // ✅ valid now — userId is @unique
    });

    if (!stored || stored.revokedAt !== null || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const isValid = await bcrypt.compare(rawToken, stored.token);
    if (!isValid) {
        throw new UnauthorizedException('Refresh token mismatch');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.login(user);
    }

    async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { revokedAt: new Date() },     // ✅ revokedAt not revoked: true
    });
    }
}