import { createServer } from 'node:http';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { attachWebSocketServer } from './infrastructure/websocket/websocket.server.js';

const app = createApp();

const httpServer = createServer(app);

attachWebSocketServer(httpServer);

httpServer.listen(env.port, () => {
  console.log(`Chatter server is running on http://localhost:${env.port}`);
  console.log(`WebSocket endpoint: ws://localhost:${env.port}${env.wsPath}`);
});