import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export interface AccessTokenPayload {
  userId: string;
}

export function createAccessToken(userId: string): string {
  return jwt.sign(
    {
      userId,
    },
    env.jwtSecret,
    {
      expiresIn: '15m',
    },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (
      typeof payload !== 'object' ||
      payload === null ||
      typeof payload.userId !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId,
    };
  } catch {
    return null;
  }
}
