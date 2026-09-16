import { randomUUID } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';
import type { SocketEvent } from './types';

const wss = new WebSocketServer({ port: 8080 });
const activeConnections = new Map<string, WebSocket>();

const chatParticipants: Record<string, string[]> = {
  '': ['', ''],
};

wss.on('connection', (ws: WebSocket) => {
  let currentUserId: string | null = null;

  ws.on('message', (rawData: string) => {
    try {
      const event = JSON.parse(rawData.toString()) as SocketEvent;

      switch (event.type) {
        case 'CLIENT_CONNECT': {
          const { userId } = event.payload;

          currentUserId = userId;

          activeConnections.set(userId, ws);
          console.log(`User ${userId} is connected to socket.`);
          break;
        }

        case 'SEND_MESSAGE': {
          if (!currentUserId) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Unauthorized' }));

            return;
          }

          const { chatId, text, senderId } = event.payload;

          const newMessageEvent: SocketEvent = {
            type: 'NEW_MESSAGE',
            payload: {
              id: randomUUID(),
              chatId,
              text,
              senderId,
              timestamp:
                'Today, ' +
                new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
            },
          };

          const serializedMessage = JSON.stringify(newMessageEvent);

          const participants = chatParticipants[chatId] || [];

          participants.forEach((recipentId) => {
            if (recipentId !== senderId) {
              const recipientSocket = activeConnections.get(recipentId);

              if (
                recipentId &&
                recipientSocket?.readyState === WebSocket.OPEN
              ) {
                recipientSocket.send(serializedMessage);
              }
            }
          });

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(serializedMessage);
          }

          console.log(
            `Message from ${event.payload.senderId}: ${event.payload.text}`,
          );
          break;
        }

        case 'USER_STATUS': {
          if (!currentUserId) {
            return;
          }

          console.log(
            `Статус ${event.payload.userId}: ${event.payload.status}`,
          );
          break;
        }
        case 'NEW_MESSAGE': {
          break;
        }
      }
    } catch (error) {
      console.error('Error procced message:', error);
    }
  });

  ws.on('close', () => {
    if (currentUserId) {
      activeConnections.delete(currentUserId);
      console.log(`User ${currentUserId} disconnected.`);

      const statusEvent: SocketEvent = {
        type: 'USER_STATUS',
        payload: {
          userId: currentUserId,
          status: 'offline',
        },
      };

      const serializedStatus = JSON.stringify(statusEvent);

      activeConnections.forEach((recipientSocket) => {
        if (recipientSocket.readyState === WebSocket.OPEN) {
          recipientSocket.send(serializedStatus);
        }
      });
    }
  });
});
