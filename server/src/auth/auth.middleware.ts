import type { NextFunction, Request, Response } from 'express';
import type { AuthService } from './auth.service';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export function createAuthMiddleware(authService: AuthService) {
  return (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      response.status(401).json({ message: 'Authentication required' });

      return;
    }

    const token = authorization.slice(7);

    const payload = authService.verifyAccessToken(token);

    if (!payload) {
      response.status(401).json({ message: 'Invalid or expired token' });

      return;
    }

    (request as AuthenticatedRequest).userId = payload.userId;

    next();
  };
}
