import cors from 'cors';
import express from 'express';

import { createAuthRouter } from './auth/auth.routes.js';
import type { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';

export function createApp(authService: AuthService) {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use('/auth', createAuthRouter(authService));

  app.get('/test', (_request, response) => {
    response.status(200).json({
      status: 'ok',
    });
  });

  return app;
}
