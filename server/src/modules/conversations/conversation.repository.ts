import type {
  Conversation,
  ConversationParticipant,
} from './conversation.types';

export interface ConversationRepository {
  create(conversation: Conversation): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  addParticipant(
    participant: ConversationParticipant,
  ): Promise<ConversationParticipant>;
  findParticipants(conversationId: string): Promise<ConversationParticipant[]>;
  isParticipant(conversationId: string, userId: string): Promise<boolean>;
}
