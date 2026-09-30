import cors from 'cors';
import express from 'express';

import {
  type AuthenticatedRequest,
  createAuthMiddleware,
} from './auth/auth.middleware.js';
import { createAuthRouter } from './auth/auth.routes.js';
import type { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';
import { createConversationRouter } from './modules/conversations/conversation.routes.js';
import type { ConversationService } from './modules/conversations/conversation.service.js';
import type { MessageService } from './modules/messages/message.service.js';
import { createUserRouter } from './modules/users/user.routes.js';
import type { UserService } from './modules/users/user.service.js';

export function createApp(
  authService: AuthService,
  conversationService: ConversationService,
  messageService: MessageService,
  userService: UserService,
) {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());

  const authMiddleware = createAuthMiddleware(authService);

  app.use(
    '/conversations',
    authMiddleware,
    createConversationRouter(conversationService, messageService),
  );

  app.use('/auth', createAuthRouter(authService, authMiddleware));

  app.get('/auth/me', authMiddleware, async (request, response) => {
    const authenticatedRequest = request as AuthenticatedRequest;

    const user = await authService.getUserById(authenticatedRequest.userId);

    if (!user) {
      response.status(401).json({ message: 'User not found' });

      return;
    }

    response.status(200).json({ user });
  });

  app.use('/users', authMiddleware, createUserRouter(userService));

  app.get('/test', (_request, response) => {
    response.status(200).json({
      status: 'ok',
    });
  });

  return app;
}
