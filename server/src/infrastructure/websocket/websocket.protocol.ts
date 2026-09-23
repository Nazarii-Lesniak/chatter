export type ClientWebSocketEvent = { type: 'system:ping' };

export type ServerWebSocketEvent =
  | {
      type: 'system:connected';
      payload: {
        path: string;
      };
    }
  | {
      type: 'system:pong';
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

    return null;
  } catch {
    return null;
  }
}
