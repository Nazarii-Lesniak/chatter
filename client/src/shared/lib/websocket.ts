import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_APR_URL ?? 'http://localhost:3001';

export type ClientWebSocketEvent =
  | { type: 'conversation:join'; payload: { conversationId: string } }
  | { type: 'conversation:leave'; payload: { conversationId: string } }
  | {
      type: 'message:send';
      payload: { conversationId: string; content: string };
    };

interface _WebSocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export type ServerWebSocketEvent =
  | { type: 'system:connected'; payload: { path: string } }
  | { type: 'system:pong' }
  | { type: 'conversation:joined'; payload: { conversationId: string } }
  | {
      type: 'message:new';
      payload: {
        message: {
          id: string;
          conversationId: string;
          senderId: string;
          content: string;
          createdAt: string;
        };
      };
    }
  | {
      type: 'error';
      payload: {
        code: string;
        message: string;
      };
    };

export type WebSocketStatus = 'closed' | 'connecting' | 'open' | 'error';

function getSocketUrl() {
  const url = new URL('/ws', API_URL);

  url.protocol = url.protocol === 'https' ? 'wss' : 'ws';

  return url.toString();
}

function parseServerEvent(data: string): ServerWebSocketEvent | null {
  try {
    const event: unknown = JSON.parse(data);

    if (
      typeof event !== 'object' ||
      event === null ||
      !('type' in event) ||
      typeof event.type !== 'string'
    ) {
      return null;
    }

    return event as ServerWebSocketEvent;
  } catch {
    return null;
  }
}

export function useChatWebSocket(
  enabled: boolean,
  onEvent: (event: ServerWebSocketEvent) => void,
) {
  const socketRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);

  const [status, setStatus] = useState<WebSocketStatus>('closed');

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = new WebSocket(getSocketUrl());

    socketRef.current = socket;
    setStatus('connecting');

    socket.onopen = () => setStatus('open');

    socket.onmessage = (event) => {
      const parsedEvent = parseServerEvent(event.data);

      if (parsedEvent) {
        onEventRef.current(parsedEvent);
      }
    };

    socket.onerror = () => setStatus('error');

    socket.onclose = () => {
      setStatus('closed');

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };

    return () => {
      socket.close(1000, 'Client unmounted');
      socketRef.current = null;
    };
  }, [enabled]);

  const send = useCallback((event: ClientWebSocketEvent) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(event));

    return true;
  }, []);

  return { status, send };
}
