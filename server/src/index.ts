import { randomUUID } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';
import type { SocketEvent, UserRecord } from './types';

const wss = new WebSocketServer({ port: 8080 });

const activeConnections = new Map<string, WebSocket>();

const users = new Map<string, UserRecord>();

const usernameIndex = new Map<string, string>();

const chatParticipants = new Map<string, Set<string>>();

function broadcast(event: SocketEvent, excludeUserId?: string) {
  const serialized = JSON.stringify(event);

  activeConnections.forEach((ws, uid) => {
    if (uid !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(serialized);
    }
  });
}

function _sendTo(userId: string, event: SocketEvent) {
  const ws = activeConnections.get(userId);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}

function sendToSocket(ws: WebSocket, event: SocketEvent) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}

function broadcastStatus(userId: string, status: 'online' | 'offline') {
  const statusEvent: SocketEvent = {
    type: 'USER_STATUS',
    payload: { userId, status },
  };
  broadcast(statusEvent);
}

wss.on('connection', (ws: WebSocket) => {
  let currentUserId: string | null = null;

  ws.on('message', (rawData: Buffer | string) => {
    try {
      const event = JSON.parse(rawData.toString()) as SocketEvent;

      switch (event.type) {
        case 'CLIENT_CONNECT': {
          const { userId } = event.payload;

          currentUserId = userId;
          activeConnections.set(userId, ws);
          console.log(`[WS] CLIENT_CONNECT userId=${userId}`);
          broadcastStatus(userId, 'online');
          break;
        }

        case 'REGISTER_USER': {
          const { userId, username, password } = event.payload;

          if (usernameIndex.has(username)) {
            sendToSocket(ws, {
              type: 'AUTH_ERROR',
              payload: { message: `Username "${username}" is already taken.` },
            });
            break;
          }

          const record: UserRecord = {
            userId,
            username,
            passwordHash: password,
          };

          users.set(userId, record);
          usernameIndex.set(username, userId);

          currentUserId = userId;
          activeConnections.set(userId, ws);

          sendToSocket(ws, {
            type: 'AUTH_SUCCESS',
            payload: { userId, username },
          });

          broadcastStatus(userId, 'online');
          console.log(
            `[WS] REGISTER_USER userId=${userId} username=${username}`,
          );
          break;
        }

        case 'LOGIN_USER': {
          const { username, password } = event.payload;

          const existingId = usernameIndex.get(username);

          if (!existingId) {
            sendToSocket(ws, {
              type: 'AUTH_ERROR',
              payload: { message: 'User not found.' },
            });
            break;
          }

          const record = users.get(existingId);

          if (!record || record.passwordHash !== password) {
            sendToSocket(ws, {
              type: 'AUTH_ERROR',
              payload: { message: 'Invalid password.' },
            });
            break;
          }

          currentUserId = existingId;
          activeConnections.set(existingId, ws);

          sendToSocket(ws, {
            type: 'AUTH_SUCCESS',
            payload: { userId: existingId, username },
          });

          broadcastStatus(existingId, 'online');
          console.log(
            `[WS] LOGIN_USER userId=${existingId} username=${username}`,
          );
          break;
        }

        case 'JOIN_CHAT': {
          const { chatId, userId } = event.payload;

          if (!chatParticipants.has(chatId)) {
            chatParticipants.set(chatId, new Set());
          }

          chatParticipants.get(chatId)?.add(userId);
          console.log(`[WS] JOIN_CHAT chatId=${chatId} userId=${userId}`);
          break;
        }

        case 'SEARCH_USERS': {
          if (!currentUserId) {
            break;
          }

          const { query } = event.payload;
          const lq = query.toLowerCase().trim();

          const results: Array<{ userId: string; username: string }> = [];

          users.forEach((record) => {
            if (
              record.userId !== currentUserId &&
              record.username.toLowerCase().includes(lq)
            ) {
              results.push({
                userId: record.userId,
                username: record.username,
              });
            }
          });

          sendToSocket(ws, {
            type: 'SEARCH_RESULT',
            payload: { users: results },
          });
          break;
        }

        case 'SEND_MESSAGE': {
          if (!currentUserId) {
            sendToSocket(ws, {
              type: 'AUTH_ERROR',
              payload: { message: 'Unauthorized' },
            });
            break;
          }

          const { chatId, text, senderId } = event.payload;

          if (!chatParticipants.has(chatId)) {
            chatParticipants.set(chatId, new Set());
          }
          chatParticipants.get(chatId)?.add(senderId);

          const timestamp =
            'Today, ' +
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

          const newMessageEvent: SocketEvent = {
            type: 'NEW_MESSAGE',
            payload: {
              id: randomUUID(),
              chatId,
              text,
              senderId,
              timestamp,
            },
          };

          const serialized = JSON.stringify(newMessageEvent);
          const participants =
            chatParticipants.get(chatId) ?? new Set<string>();

          participants.forEach((participantId) => {
            const recipientWs = activeConnections.get(participantId);

            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(serialized);
            }
          });

          if (!participants.has(senderId) && ws.readyState === WebSocket.OPEN) {
            ws.send(serialized);
          }

          console.log(
            `[WS] SEND_MESSAGE chatId=${chatId} from=${senderId}: ${text}`,
          );
          break;
        }

        case 'USER_STATUS': {
          console.log(
            `[WS] USER_STATUS userId=${event.payload.userId} status=${event.payload.status}`,
          );
          break;
        }

        case 'NEW_MESSAGE':
        case 'SEARCH_RESULT':
        case 'AUTH_SUCCESS':
        case 'AUTH_ERROR':
          break;
      }
    } catch (error) {
      console.error('[WS] Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (currentUserId) {
      activeConnections.delete(currentUserId);
      console.log(`[WS] Disconnected userId=${currentUserId}`);
      broadcastStatus(currentUserId, 'offline');
    }
  });
});

console.log('[WS] Server running on ws://localhost:8080');
