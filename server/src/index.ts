import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocket, WebSocketServer } from 'ws';
import type { SocketEvent, UserRecord } from './types';

const wss = new WebSocketServer({ port: 8080 });

const activeConnections = new Map<string, Set<WebSocket>>();

const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadUsers(): Map<string, UserRecord> {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      return new Map(Object.entries(data));
    } catch {
      return new Map();
    }
  }
  return new Map();
}

const users = loadUsers();
const usernameIndex = new Map<string, string>();

users.forEach((record) => {
  usernameIndex.set(record.username, record.userId);
});
function saveUsers() {
  const obj = Object.fromEntries(users.entries());
  fs.writeFileSync(USERS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
}

const chatParticipants = new Map<string, Set<string>>();

function broadcast(event: SocketEvent, excludeUserId?: string) {
  const serialized = JSON.stringify(event);

  activeConnections.forEach((sockets, uid) => {
    if (uid !== excludeUserId) {
      return;
    }

    sockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(serialized);
      }
    });
  });
}

function _sendTo(userId: string, event: SocketEvent) {
  const sockets = activeConnections.get(userId);

  if (!sockets) {
    return;
  }

  const serialized = JSON.stringify(event);

  sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(serialized);
    }
  });
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

function registerConnection(userId: string, ws: WebSocket) {
  if (!activeConnections.has(userId)) {
    activeConnections.set(userId, new Set());
  }
  activeConnections.get(userId)?.add(ws);
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
          registerConnection(userId, ws);
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
          saveUsers();

          currentUserId = userId;
          registerConnection(userId, ws);

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
          registerConnection(existingId, ws);

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

          const participants = chatId.split('_');

          participants.forEach((participantId) => {
            const userSockets = activeConnections.get(participantId);
            if (userSockets) {
              userSockets.forEach((recipientWs) => {
                if (recipientWs.readyState === WebSocket.OPEN) {
                  recipientWs.send(serialized);
                }
              });
            }
          });

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
    if (!currentUserId) {
      return;
    }

    const userSockets = activeConnections.get(currentUserId);

    if (userSockets) {
      userSockets.delete(ws);

      if (userSockets.size === 0) {
        activeConnections.delete(currentUserId);
        console.log(`[WS] Disconnected userId=${currentUserId}`);

        broadcastStatus(currentUserId, 'offline');
      }
    }
  });
});

console.log('[WS] Server running on ws://localhost:8080');
