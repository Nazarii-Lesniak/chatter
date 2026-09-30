import type { NextFunction, Request, Response } from 'express';
import { getCookie } from './auth.cookie';
import type { AuthService } from './auth.service';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export function createAuthMiddleware(authService: AuthService) {
  return (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.headers.authorization;

    let token: string | null = null;

    if (authorization?.startsWith('Bearer ')) {
      token = authorization.slice(7);
    }

    if (!token) {
      token = getCookie(request.headers.cookie, 'access_token');
    }

    if (!token) {
      response.status(401).json({ message: 'Authentication required' });

      return;
    }

    const payload = authService.verifyAccessToken(token);

    if (!payload) {
      response.status(401).json({ message: 'Invalid or expired token' });

      return;
    }

    (request as unknown as AuthenticatedRequest).userId = payload.userId;

    next();
  };
}
