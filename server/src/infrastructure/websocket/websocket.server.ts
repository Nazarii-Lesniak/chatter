import type { IncomingMessage, Server as HttpServer } from 'node:http';
import { WebSocketServer } from 'ws';

import { env } from '../../config/env.js';

export function attachWebSocketServer(httpServer: HttpServer) {
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 64 * 1024,
  });

  httpServer.on('upgrade', (request, socket, head) => {
    const requestUrl = new URL(
      request.url ?? '/',
      `http://${request.headers.host ?? 'localhost'}`,
    );

    if (requestUrl.pathname !== env.wsPath) {
      socket.destroy();

      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (socket, request: IncomingMessage) => {
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socket.send(
      JSON.stringify({
        type: 'system:connected',
        payload: {
          path: request.url,
        },
      }),
    );
  });

  return wss;
}