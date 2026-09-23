import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
    }),
  );

  app.use(express.json());

  app.get('/', (_request, response) => {
    response.status(200).json({
      service: 'chatter-server',
      status: 'ok',
    });
  });

  app.get('/test', (_request, response) => {
    response.status(200).json({
      status: 'ok',
    });
  });

  return app;
}