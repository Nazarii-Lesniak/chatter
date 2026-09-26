import cors from 'cors';
import express from 'express';

import { createAuthRouter } from './auth/auth.routes.js';
import type { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';
import type { ConversationService } from './modules/conversations/conversation.service.js';

export function createApp(
  authService: AuthService,
  conversationService: ConversationService,
) {
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

  app.post('/conversations', async (request, response) => {
    try {
      const { firstUserId, secondUserId } = request.body;

      const conversation = await conversationService.createPrivateConversation(
        firstUserId,
        secondUserId,
      );

      response.status(201).json({ conversation });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'CONVERSATION_REQUIRES_TWO_USERS'
      ) {
        response
          .status(400)
          .json({ message: 'Conversation requires two different users' });

        return;
      }

      console.error('Conversation creation error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  return app;
}
