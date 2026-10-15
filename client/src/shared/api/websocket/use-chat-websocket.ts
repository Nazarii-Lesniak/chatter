import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import { authApi } from '../auth.api';
import { type ChatSocket, createChatSocket } from './chat-socket';
import type {
  ClientWebSocketEvent,
  ServerWebSocketEvent,
  WebSocketStatus,
} from './events';
import { buildSocketUrl } from './url';

export function useChatWebSocket(
  enabled: boolean,
  onEvent: (event: ServerWebSocketEvent) => void,
) {
  const socketRef = useRef<ChatSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('closed');

  const handleEvent = useEffectEvent(onEvent);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = createChatSocket({
      getTicket: authApi.createWebSocketTicket,
      buildUrl: buildSocketUrl,
      onEvent: (event) => handleEvent(event),
      onStatusChange: setStatus,
    });

    socketRef.current = socket;

    const reconnectIfNeeded = () => {
      if (document.visibilityState === 'visible') {
        socket.reconnectNow();
      }

      window.addEventListener('online', reconnectIfNeeded);
      document.addEventListener('visibilitychange', reconnectIfNeeded);
    };

    return () => {
      window.removeEventListener('online', reconnectIfNeeded);
      document.removeEventListener('visibilitychange', reconnectIfNeeded);

      socket.close();
      socketRef.current = null;
    };
  }, [enabled]);

  const send = useCallback((event: ClientWebSocketEvent) => {
    return socketRef.current?.send(event) ?? false;
  }, []);

  return { status: enabled ? status : 'closed', send };
}
