import type { SocketEvent } from '../../../../server/src/types';

type MessageCallback = (event: SocketEvent) => void;

class SocketClient {
  private socket: WebSocket | null = null;
  private subscribers: Set<MessageCallback> = new Set();
  private url: string = 'ws://localhost:8080';
  private userId: string | null = null;
  private reconectTimer: NodeJS.Timeout | null = null;
  private isExplicitlyClose = false;

  public connect(userId: string, url?: string) {
    if (url) {
      this.url = url;
    }

    this.userId = userId;
    this.isExplicitlyClose = false;

    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('[WebSocket] Is connected');

      if (this.userId) {
        this.send({
          type: 'CLIENT_CONNECT',
          payload: { userId: this.userId },
        });
      }
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const parsedEvent = JSON.parse(event.data);

        this.subscribers.forEach((callback) => {
          callback(parsedEvent);
        });
      } catch (error) {
        console.error('[WebSocket] Parse error:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    this.socket.onclose = () => {
      console.warn('[WebSocket] Connection is lost');
      this.socket = null;

      if (!this.isExplicitlyClose && this.userId) {
        if (this.reconectTimer) {
          clearTimeout(this.reconectTimer);
        }

        this.reconectTimer = setTimeout(() => {
          console.log('[WebSocket] Try reconnect...');

          if (this.userId) {
            this.connect(this.userId);
          }
        }, 3000);
      }
    };
  }

  public onMessage(callback: MessageCallback): () => void {
    this.subscribers.add(callback);

    return () => this.offMessage(callback);
  }

  public offMessage(callback: MessageCallback) {
    this.subscribers.delete(callback);
  }

  public send(event: SocketEvent) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    } else {
      console.warn('[WebSocket] Cannot send: socket is not ready');
    }
  }

  public disconnect() {
    this.isExplicitlyClose = true;

    if (this.reconectTimer) {
      clearTimeout(this.reconectTimer);
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClient();
