export type ClientWebSocketEvent =
  | { type: 'system:ping' }
  | { type: 'conversation:join'; payload: { conversationId: string } }
  | {
      type: 'message:send';
      payload: { conversationId: string; content: string };
    };

export type ServerWebSocketEvent =
  | { type: 'system:connected'; payload: { path: string } }
  | { type: 'system:pong' }
  | { type: 'conversation:joined'; payload: { conversationIs: string } }
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

export function parseClientEvent(
  rawMessage: string,
): ClientWebSocketEvent | null {
  try {
    const parsed: unknown = JSON.parse(rawMessage);

    if (typeof parsed !== 'object' || parsed === null || !('type' in parsed)) {
      return null;
    }

    if (parsed.type === 'system:ping') {
      return {
        type: 'system:ping',
      };
    }

    if (parsed.type === 'conversation:join') {
      if (
        !('payload' in parsed) ||
        typeof parsed.payload !== 'object' ||
        parsed.payload === null ||
        !('conversationId' in parsed.payload) ||
        typeof parsed.payload.conversationId !== 'string'
      ) {
        return null;
      }

      return {
        type: 'conversation:join',
        payload: {
          conversationId: parsed.payload.conversationId,
        },
      };
    }

    if (parsed.type === 'message:send') {
      if (
        !('payload' in parsed) ||
        typeof parsed.payload !== 'object' ||
        parsed.payload === null ||
        !('conversationId' in parsed.payload) ||
        !('content' in parsed.payload) ||
        typeof parsed.payload.conversationId !== 'string' ||
        typeof parsed.payload.content !== 'string'
      ) {
        return null;
      }

      return {
        type: 'message:send',
        payload: {
          conversationId: parsed.payload.conversationId,
          content: parsed.payload.content,
        },
      };
    }
    return null;
  } catch {
    return null;
  }
}
