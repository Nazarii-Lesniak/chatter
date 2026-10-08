import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/shared/api/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type ClientWebSocketEvent =
  | { type: 'system:ping' }
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
      type: 'presence:initial';
      payload: {
        onlineUserIds: string[];
      };
    }
  | {
      type: 'user:status';
      payload: {
        userId: string;
        status: 'online' | 'offline';
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

const HEARTBEAT_INTERVAL_MS = 25_000;
const MAX_RECONNECT_DELAY_MS = 15_000;

async function fetchWebSocketTicket(): Promise<string> {
  const { ticket } = await apiClient<{ ticket: string }>('/auth/ws-ticket', {
    method: 'POST',
  });

  return ticket;
}

function getSocketUrl(ticket: string) {
  const base = API_URL || 'http://localhost:3001';

  const url = new URL('/ws', base);

  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.searchParams.set('ticket', ticket);

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

    let cancelled = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let attempt = 0;

    function stopHeartbeat() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }

    function scheduleReconnect() {
      const delay = Math.min(1000 * 2 ** attempt, MAX_RECONNECT_DELAY_MS);

      attempt += 1;
      reconnectTimer = setTimeout(connect, delay);
    }

    async function connect() {
      setStatus('connecting');

      let ticket: string;

      try {
        ticket = await fetchWebSocketTicket();
      } catch {
        if (!cancelled) {
          setStatus('error');
          scheduleReconnect();
        }

        return;
      }

      if (cancelled) {
        return;
      }

      const ws = new WebSocket(getSocketUrl(ticket));

      socket = ws;
      socketRef.current = ws;

      ws.onopen = () => {
        attempt = 0;
        setStatus('open');

        heartbeatTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'system:ping' }));
          }
        }, HEARTBEAT_INTERVAL_MS);
      };

      ws.onmessage = (event) => {
        const parsedEvent = parseServerEvent(event.data);

        if (parsedEvent) {
          onEventRef.current(parsedEvent);
        }
      };

      ws.onerror = () => setStatus('error');

      ws.onclose = () => {
        stopHeartbeat();

        if (socketRef.current === ws) {
          socketRef.current = null;
        }

        if (cancelled) {
          return;
        }

        setStatus('closed');
        scheduleReconnect();
      };
    }

    connect();

    return () => {
      cancelled = true;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      stopHeartbeat();
      socket?.close(1000, 'Client unmounted');
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
