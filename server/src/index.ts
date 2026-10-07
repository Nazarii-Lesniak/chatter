import { createServer } from 'node:http';
import { createApp } from './app.js';

import { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';
import { database } from './infrastructure/database/batabase.js';
import { attachWebSocketServer } from './infrastructure/websocket/websocket.server.js';
import { ConversationService } from './modules/conversations/conversation.service.js';
import { PostgresConversationRepository } from './modules/conversations/postgres-conversation.repository.js';
import { MessageService } from './modules/messages/message.service.js';
import { PostgresMessageRepository } from './modules/messages/postgres-message.repository.js';
import { PostgresUserRepository } from './modules/users/postgres-user.repository.js';
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
  messageRepository,
);

const app = createApp(
  authService,
  conversationService,
  messageService,
  userService,
);
const httpServer = createServer(app);

attachWebSocketServer(
  httpServer,
  authService,
  messageService,
  conversationRepository,
);

const HOST = '0.0.0.0';

httpServer.listen(env.port, HOST, () => {
  console.log(`Chatter server is running on http://localhost:${env.port}`);
  console.log(`WebSocket endpoint: ws://localhost:${env.port}${env.wsPath}`);
});
