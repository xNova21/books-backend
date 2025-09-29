import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    return validateRequest(request);
  }
}

// Extiende el tipo Request para incluir userId
interface AuthenticatedRequest extends ExpressRequest {
  userId?: string;
}

function validateRequest(request: ExpressRequest): boolean {
  const authHeader =
    request.headers['authorization'] || request.headers['Authorization'];
  if (!authHeader) {
    return false;
  }
  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const token =
    typeof headerValue === 'string' && headerValue.startsWith('Bearer ')
      ? headerValue.split(' ')[1]
      : null;
  if (!token) {
    return false;
  }
  let decoded: jwt.JwtPayload | string;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET ?? '');
  } catch {
    return false;
  }
  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof (decoded as { userId?: unknown }).userId !== 'string'
  ) {
    return false;
  }
  (request as AuthenticatedRequest).userId = (
    decoded as { userId: string }
  ).userId;
  return true;
}
