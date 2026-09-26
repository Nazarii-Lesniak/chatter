import type { Server as HttpServer, IncomingMessage } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { getCookie } from '../../auth/auth.cookie.js';
import type { AuthService } from '../../auth/auth.service.js';
import { env } from '../../config/env.js';
import type { ConversationRepository } from '../../modules/conversations/conversation.repository.js';
import type { MessageService } from '../../modules/messages/message.service.js';
import {
  parseClientEvent,
  type ServerWebSocketEvent,
} from './websocket.protocol.js';

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

  function subscribeToConversation(conversationId: string, socket: WebSocket) {
    let sockets = conversationSockets.get(conversationId);

    if (!sockets) {
      sockets = new Set<WebSocket>();

      conversationSockets.set(conversationId, sockets);
    }

    sockets.add(socket);
  }

  function unsubscribeFromAllConversation(_socket: WebSocket) {
    for (const [conversationId, sockets] of conversationSockets) {
      if (sockets.size === 0) {
        conversationSockets.delete(conversationId);
      }
    }
  }

  function broadcastToConversation(
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

    const client: AuthenticatedClient = {
      userId: user.id,
    };

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, client);
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

          const conversation =
            await conversationRepository.findById(conversationId);

          if (!conversation) {
            sendError(
              socket,
              'CONVERSATION_NOT_FOUND',
              'Conversation not found',
            );

            return;
          }

          const isParticipant = await conversationRepository.isParticipant(
            conversationId,
            client.userId,
          );

          if (!isParticipant) {
            sendError(
              socket,
              'FORBIDDEN',
              'You are not a participant of this conversation',
            );

            return;
          }

          subscribeToConversation(conversationId, socket);

          sendEvent(socket, {
            type: 'conversation:joined',
            payload: {
              conversationId,
            },
          });
        }

        if (event.type === 'message:send') {
          const { conversationId, content } = event.payload;

          try {
            const message = await messageService.sendMessage(
              client.userId,
              conversationId,
              content,
            );

            broadcastToConversation(conversationId, {
              type: 'message:new',
              payload: { message },
            });
          } catch (error) {
            if (!(error instanceof Error)) {
              sendError(
                socket,
                'INTERNAL_SERVER_ERROR',
                'Internal server error',
              );

              return;
            }

            switch (error.message) {
              case 'CONVERSATION_NOT_FOUND':
                sendError(
                  socket,
                  'CONVERSATION_NOT_FOUND',
                  'Conversation not found',
                );

                return;

              case 'FORBIDDEN':
                sendError(
                  socket,
                  'FORBIDDEN',
                  'You are not a participant of this conversation',
                );

                return;

              case 'MESSAGE_CONTENT_EMPTY':
                sendError(
                  socket,
                  'MESSAGE_CONTENT_EMPTY',
                  'Message content cannot be empty',
                );

                return;

              default:
                console.error('WebSocket message error:', error);

                sendError(
                  socket,
                  'INTERNAL_SERVER_ERROR',
                  'Internal server error',
                );

                return;
            }
          }
        }
      });

      socket.on('close', () => {
        unsubscribeFromAllConversation(socket);
      });
    },
  );

  return wss;
}
