import type { Server as HttpServer, IncomingMessage } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { getCookie } from '../../auth/auth.cookie.js';
import type { AuthService } from '../../auth/auth.service.js';
import { env } from '../../config/env.js';
import {
  parseClientEvent,
  type ServerWebSocketEvent,
} from './websocket.protocol.js';
import { MessageService } from '../../modules/messages/message.service.js';
import { ConversationRepository } from '../../modules/conversations/conversation.repository.js';

interface AuthenticatedClient {
  userId: string;
}

function sendError(socket: WebSocket, code: string, message: string) {
  sendEvent(socket, {
    type: 'error',
    payload: {
      code,
      message,
    },
  });
}

function sendEvent(socket: WebSocket, event: ServerWebSocketEvent) {
  socket.send(JSON.stringify(event));
}

export function attachWebSocketServer(
  httpServer: HttpServer,
  authService: AuthService,
  messageService: MessageService,
  conversationRepository: ConversationRepository,
) {
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 64 * 1024,
  });

  const conversationSockets = new Map<string, Set<WebSocket>>();

  function subscribeToConversation(
    conversationId: string,
    socket: WebSocket,
  ) {
    let sockets = conversationSockets.get(conversationId);

    if (!sockets) {
      sockets = new Set<WebSocket>();

      conversationSockets.set(conversationId, sockets);
    }

   sockets.add(socket);
  }

  function briadcoastToConversation(
    conversationId: string,
    event: ServerWebSocketEvent,
  ) {
    const sockets = conversationSockets.get(conversationId);

    if (!sockets) {
      return;
    }

    for (const socket of sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        sendEvent(socket, event);
      }
    }
  }

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
      client: AuthenticatedClient,
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

      socket.on('message', async (data) => {
        const event = parseClientEvent(data.toString());

        if (!event) {
          return;
        }

        if (event.type === 'system:ping') {
          sendEvent(socket, {
            type: 'system:pong',
          });
        }

        if (event.type === 'conversation:join') {
          const { conversationId } = event.payload;

          const conversation = await conversationRepository.findById(conversationId);

          if (!conversation) {
            sendError(socket, 'CONVERSATION_NOT_FOUND', 'Conversation not found');

            return;
          }

          const isParticipant = await conversationRepository.isParticipant(conversationId, client.userId);

          if (!isParticipant) {
            sendError(socket, 'FORBIDDEN', 'You are not a participant of this conversation');

            return;
          }

          subscribeToConversation(conversationId, socket);

          sendEvent(socket, {
            type: 'conversation:joined',
            payload: {
              conversationId,
            }
          })
        }
      });
    },
  );

  return wss;
}
