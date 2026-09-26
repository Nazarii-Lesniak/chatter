import { randomUUID } from 'node:crypto';
import type {
  Conversation,
  ConversationParticipant,
} from './conversation.types';

export function createConversation(): Conversation {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

export function createConversationParticipant(
  conversationId: string,
  userId: string,
): ConversationParticipant {
  return {
    conversationId,
    userId: userId,
    joinedAt: new Date().toISOString(),
  };
}
