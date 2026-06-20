import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    public readonly code: string,
    status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super({ message, code, success: false }, status);
  }
}

export const BusinessErrors = {
  LEAD_ALREADY_CONVERTED: 'LEAD_ALREADY_CONVERTED',
  DEAL_ALREADY_CLOSED: 'DEAL_ALREADY_CLOSED',
  TEAM_MEMBER_ALREADY_EXISTS: 'TEAM_MEMBER_ALREADY_EXISTS',
  INVALID_STAGE_TRANSITION: 'INVALID_STAGE_TRANSITION',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
} as const;