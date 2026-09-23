import type { Server as HttpServer, IncomingMessage } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import { env } from '../../config/env.js';
import {
  parseClientEvent,
  type ServerWebSocketEvent,
} from './websocket.protocol.js';

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

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (socket, request: IncomingMessage) => {
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
  });

  return wss;
}
