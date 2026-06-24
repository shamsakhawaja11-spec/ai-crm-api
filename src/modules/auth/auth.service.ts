import { PrismaService } from '@/database/prisma.service';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  // ─── Validate user credentials (used by LocalStrategy) ───────────────────
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('User does not exist');
    if (!user.isEmailVerified) throw new UnauthorizedException('Email not verified');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Incorrect password');

    return user;
  }

  // ─── Login: issue access + refresh tokens ─────────────────────────────────
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access' as const,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // ─── Me ───────────────────────────────────────────────────────────────────
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        phone: true,
        timezone: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  // ─── Refresh tokens ───────────────────────────────────────────────────────
  async refreshTokens(rawToken: string) {
    // Decode without verifying to extract sub (userId)
    let payload: { sub: string; type: string };
    try {
      payload = this.jwtService.verify(rawToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Wrong token type');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { userId: payload.sub },
      include: { user: true },
    });

    if (!stored || stored.revokedAt !== null || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    // Compare raw JWT string against stored hash
    const isValid = await this.compareRefreshToken(rawToken, stored.token);
    if (!isValid) throw new UnauthorizedException('Refresh token mismatch');

    return this.login(stored.user);
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });
  }

  // ─── Private: generate access token ──────────────────────────────────────
  private generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
      issuer: 'ai-crm',
      audience: 'ai-crm-client',
    });
  }

  // ─── Private: generate + persist refresh token ───────────────────────────
  private async generateRefreshToken(user: User): Promise<string> {
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        this.configService.get<number>('jwt.refreshExpiresInDays', 7),
    );

    // Issue refresh token as signed JWT so we can extract userId from it
    const rawToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: `${this.configService.get<number>('jwt.refreshExpiresInDays', 7)}d`,
        issuer: 'ai-crm',
        audience: 'ai-crm-client',
      },
    );

    const hashedToken = await bcrypt.hash(rawToken, 10);

    await this.prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: hashedToken, expiresAt, revokedAt: null },
      create: { userId: user.id, token: hashedToken, expiresAt },
    });

    return rawToken;
  }

  // ─── Private: compare refresh token against hash ─────────────────────────
  private async compareRefreshToken(
    rawToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(rawToken, hashedToken);
  }
}