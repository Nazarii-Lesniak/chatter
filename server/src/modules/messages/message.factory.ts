import { randomUUID } from 'node:crypto';

import type { Message } from './message.types';

export function createMessage(
  conversationId: string,
  senderId: string,
  content: string,
): Message {
  return {
    id: randomUUID(),
    conversationId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
  };
}
