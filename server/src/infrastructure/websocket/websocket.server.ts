import type { Server as HttpServer, IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import { getCookie } from '../../auth/auth.cookie.js';
import type { AuthService } from '../../auth/auth.service.js';
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

export function attachWebSocketServer(
  httpServer: HttpServer,
  authService: AuthService,
) {
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 64 * 1024,
  });

  httpServer.on('upgrade', async (request, socket, head) => {
    const requestUrl = new URL(
      request.url ?? '/',
      `http://${request.headers.host ?? 'localhost'}`,
    );

    if (requestUrl.pathname !== env.wsPath) {
      socket.destroy();

      return;
    }

    const token = getCookie(request.headers.cookie, 'access_token');

    if (!token) {
      socket.write('HTTP/1.1 Unauthorized\r\n\r\n');

      socket.destroy();

      return;
    }

    const payload = authService.verifyAccessToken(token);

    if (!payload) {
      socket.write('HTTP/1.1 Unauthorized\r\n\r\n');

      socket.destroy();

      return;
    }

    const user = await authService.getUserById(payload.userId);

    if (!user) {
      socket.write('HTTP/1.1 Unauthorized\r\n\r\n');

      socket.destroy();

      return;
    }

    const _client: AuthenticatedClient = {
      userId: user.id,
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
