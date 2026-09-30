import { createServer } from 'node:http';

import app from './app.js';
import { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';
import { database } from './infrastructure/database/batabase.js';
import { attachWebSocketServer } from './infrastructure/websocket/websocket.server.js';
import { PostgresConversationRepository } from './modules/conversations/postgres-conversation.repository.js';
import { MessageService } from './modules/messages/message.service.js';
import { PostgresMessageRepository } from './modules/messages/postgres-message.repository.js';
import { PostgresUserRepository } from './modules/users/postgres-user.repository.js';

const userRepository = new PostgresUserRepository(database);
const conversationRepository = new PostgresConversationRepository(database);
const messageRepository = new PostgresMessageRepository(database);

const authService = new AuthService(userRepository);

const messageService = new MessageService(
  messageRepository,
  conversationRepository,
);

const httpServer = createServer(app);

attachWebSocketServer(
  httpServer,
  authService,
  messageService,
  conversationRepository,
);

export default httpServer;

if (!process.env.VERCEL) {
  httpServer.listen(env.port, () => {
    console.log(`Chatter server is running on http://localhost:${env.port}`);
    console.log(`WebSocket endpoint: ws://localhost:${env.port}${env.wsPath}`);
  });
}
