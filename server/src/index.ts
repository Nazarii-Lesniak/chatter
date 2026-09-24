import { createServer } from 'node:http';
import { createApp } from './app.js';

import { AuthService } from './auth/auth.service.js';
import { env } from './config/env.js';
import { attachWebSocketServer } from './infrastructure/websocket/websocket.server.js';
import { InMemoryUserRepository } from './modules/users/in-memory-user.repository.js';

const userRepository = new InMemoryUserRepository();
const authService = new AuthService(userRepository);

const app = createApp(authService);
const httpServer = createServer(app);

attachWebSocketServer(httpServer, authService);

httpServer.listen(env.port, () => {
  console.log(`Chatter server is running on http://localhost:${env.port}`);
  console.log(`WebSocket endpoint: ws://localhost:${env.port}${env.wsPath}`);
});
