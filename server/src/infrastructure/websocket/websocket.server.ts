import type { Server as HttpServer, IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import { getCookies } from '../../auth/auth.cookie.js';
import { verifyAccessToken } from '../../auth/auth.service.js';
import { env } from '../../config/env.js';
import {
  parseClientEvent,
  type ServerWebSocketEvent,
} from './websocket.protocol.js';

interface AuthenticatedClient {
  userId: string;
}

function sendEvent(socket: WebSocket, event: ServerWebSocketEvent) {
  socket.send(JSON.stringify(event));
}

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

    const token = getCookies(request.headers.cookie, 'access_token');

    if (!token) {
      socket.write('HTTP/1.1 Unauthorized\r\n\r\n');

      socket.destroy();

      return;
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      socket.write('HTTP/1.1 Unauthorized\r\n\r\n');

      socket.destroy();

      return;
    }

    const _client: AuthenticatedClient = {
      userId: payload.userId,
    };

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on(
    'connection',
    (
      socket: WebSocket,
      request: IncomingMessage,
      _client: AuthenticatedClient,
    ) => {
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      sendEvent(socket, {
        type: 'system:connected',
        payload: {
          path: request.url ?? '/',
        },
      });

      socket.on('message', (data) => {
        const event = parseClientEvent(data.toString());

        if (!event) {
          return;
        }

        if (event.type === 'system:ping') {
          sendEvent(socket, {
            type: 'system:pong',
          });
        }
      });
    },
  );

  return wss;
}
