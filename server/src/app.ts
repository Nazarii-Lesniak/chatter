import cors from 'cors';
import express from 'express';

import {
  type AuthenticatedRequest,
  createAuthMiddleware,
} from './auth/auth.middleware.js';
import { createAuthRouter } from './auth/auth.routes.js';
import { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';
import { database } from './infrastructure/database/batabase.js';
import { createConversationRouter } from './modules/conversations/conversation.routes.js';
import { ConversationService } from './modules/conversations/conversation.service.js';
import { PostgresConversationRepository } from './modules/conversations/postgres-conversation.repository.js';
import { MessageService } from './modules/messages/message.service.js';
import { PostgresMessageRepository } from './modules/messages/postgres-message.repository.js';
import { PostgresUserRepository } from './modules/users/postgres-user.repository.js';
import { createUserRouter } from './modules/users/user.routes.js';
import { UserService } from './modules/users/user.service.js';

const userRepository = new PostgresUserRepository(database);
const conversationRepository = new PostgresConversationRepository(database);
const messageRepository = new PostgresMessageRepository(database);

const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);

const messageService = new MessageService(
  messageRepository,
  conversationRepository,
);

const conversationService = new ConversationService(
  conversationRepository,
  userRepository,
);

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
  const authenticatedRequest = request as unknown as AuthenticatedRequest;

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

export default app;
