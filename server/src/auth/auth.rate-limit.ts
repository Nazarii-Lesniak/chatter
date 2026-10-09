import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

const MINUTE_MS = 60 * 1000;

const tooManyRequests = {
  message: 'Too many attempts. Please try again later.',
};

export const loginRateLimiter = rateLimit({
  windowMs: 15 * MINUTE_MS,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: tooManyRequests,
  keyGenerator: (request) => {
    const username =
      typeof request.body?.username === 'string'
        ? request.body.username.trim().toLowerCase().slice(0, 64)
        : '';

    return `${ipKeyGenerator(request.ip ?? '')}|${username}`;
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * MINUTE_MS,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooManyRequests,
});
