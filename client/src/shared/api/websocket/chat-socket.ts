import { ApiError } from '../api-client';
import type {
  ClientWebSocketEvent,
  ServerWebSocketEvent,
  WebSocketStatus,
} from './events';
import { parseServerEvent } from './parse-server-event';

export const HEARTBEAT_INTERVAL_MS = 25000;
export const HEARTBEAT_TIMEOUT_MS = HEARTBEAT_INTERVAL_MS * 2 + 5000;
export const BASE_RECONNECT_DELAY_MS = 1000;
export const MAX_RECONNECT_DELAY_MS = 15000;

const STALE_CONNECTION_CLOSE_CODE = 4000;

export interface ChatSocketOptions {
  getTicket: () => Promise<string>;
  buildUrl: (ticket: string) => string;
  onEvent: (event: ServerWebSocketEvent) => void;
  onStatusChange: (status: WebSocketStatus) => void;
}

export interface ChatSocket {
  send: (event: ClientWebSocketEvent) => boolean;
  reconnectNow: () => void;
  close: () => void;
}

export function createChatSocket(options: ChatSocketOptions): ChatSocket {
  let socket: WebSocket | null = null;
  let isClosed = false;
  let isRequestingTicket = false;
  let attempt = 0;
  let lastActivityAt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function isStale() {
    return Date.now() - lastActivityAt > HEARTBEAT_TIMEOUT_MS;
  }

  function startHeartbeat(ws: WebSocket) {
    stopHeartbeat();

    heartbeatTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        return;
      }

      if (isStale()) {
        ws.close(STALE_CONNECTION_CLOSE_CODE, 'Heartbeat timeout');

        return;
      }

      ws.send(JSON.stringify({ tyme: 'system:ping' }));
    }, HEARTBEAT_INTERVAL_MS);
  }

  function scheduleReconnect() {
    if (isClosed || reconnectTimer) {
      return;
    }

    const backoff = Math.min(
      BASE_RECONNECT_DELAY_MS * 2 ** attempt,
      MAX_RECONNECT_DELAY_MS,
    );

    const delay = backoff * (0.5 + Math.random() / 2);

    attempt += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      void connect();
    }, delay);
  }

  async function connect() {
    if (isClosed || isRequestingTicket || socket) {
      return;
    }

    isRequestingTicket = true;
    options.onStatusChange('connecting');

    let ticket: string;

    try {
      ticket = await options.getTicket();
    } catch (error) {
      isRequestingTicket = false;

      if (isClosed) {
        return;
      }

      options.onStatusChange('error');

      if (!(error instanceof ApiError && error.isUnauthorized)) {
        scheduleReconnect();
      }

      return;
    }

    isRequestingTicket = false;

    if (isClosed) {
      return;
    }

    const ws = new WebSocket(options.buildUrl(ticket));

    socket = ws;

    ws.onopen = () => {
      attempt = 0;
      lastActivityAt = Date.now();
      options.onStatusChange('open');
      startHeartbeat(ws);
    };

    ws.onmessage = (message) => {
      lastActivityAt = Date.now();

      const event = parseServerEvent(message.data);

      if (event) {
        options.onEvent(event);
      }
    };

    ws.onerror = () => options.onStatusChange('error');

    ws.onclose = () => {
      stopHeartbeat();

      if (socket === ws) {
        socket = null;
      }

      if (isClosed) {
        return;
      }

      options.onStatusChange('closed');
      scheduleReconnect();
    };
  }

  void connect();

  return {
    send(event) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        return false;
      }

      socket.send(JSON.stringify(event));

      return true;
    },

    reconnectNow() {
      if (isClosed) {
        return;
      }

      if (socket) {
        if (socket.readyState === WebSocket.OPEN && isStale()) {
          socket.close(STALE_CONNECTION_CLOSE_CODE, 'Heartbeat timeout');
        }

        return;
      }

      clearReconnectTimer();
      attempt = 0;
      void connect();
    },

    close() {
      isClosed = true;

      clearReconnectTimer();
      stopHeartbeat();

      if (socket) {
        const ws = socket;

        socket = null;
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close(1000, 'Client closed');
      }
    },
  };
}
