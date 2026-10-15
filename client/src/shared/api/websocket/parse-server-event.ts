import type { ServerWebSocketEvent } from './events';

const SERVER_EVENT_TYPES: ReadonlySet<string> = new Set<
  ServerWebSocketEvent['type']
>([
  'system:connected',
  'system:pong',
  'conversation:joined',
  'message:new',
  'presence:initial',
  'user:status',
  'error',
]);

export function parseServerEvent(data: unknown): ServerWebSocketEvent | null {
  if (typeof data !== 'string') {
    return null;
  }

  try {
    const event: unknown = JSON.parse(data);

    if (
      typeof event !== 'object' ||
      event === null ||
      !('type' in event) ||
      typeof event.type !== 'string' ||
      !SERVER_EVENT_TYPES.has(event.type)
    ) {
      return null;
    }

    return event as ServerWebSocketEvent;
  } catch {
    return null;
  }
}
