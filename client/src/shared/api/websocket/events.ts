import type { MessageDto } from '../types';

export type ClientWebSocketEvent =
  | { type: 'system:ping' }
  | { type: 'conversation:join'; payload: { conversationId: string } }
  | { type: 'conversation:leave'; payload: { conversationId: string } }
  | {
      type: 'message:send';
      payload: { conversationId: string; content: string };
    };

export type ServerWebSocketEvent =
  | { type: 'system:connected'; payload: { path: string } }
  | { type: 'system:pong' }
  | { type: 'conversation:joined'; payload: { conversationId: string } }
  | { type: 'message:new'; payload: { message: MessageDto } }
  | { type: 'presence:initial'; payload: { onlineUserIds: string[] } }
  | {
      type: 'user:status';
      payload: { userId: string; status: 'online' | 'offline' };
    }
  | { type: 'error'; payload: { code: string; message: string } };

export type WebSocketStatus = 'closed' | 'connecting' | 'open' | 'error';
