import type { ConversationRepository } from './conversation.repository';
import type {
  Conversation,
  ConversationParticipant,
} from './conversation.types';

export class InMemoryConversationRepository implements ConversationRepository {
  private readonly conversation = new Map<string, Conversation>();

  private readonly participants = new Map<string, ConversationParticipant[]>();

  async create(conversation: Conversation): Promise<Conversation> {
    this.conversation.set(conversation.id, conversation);
    this.participants.set(conversation.id, []);

    return conversation;
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.conversation.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    const result: Conversation[] = [];

    for (const conversation of this.conversation.values()) {
      const isParticipant = await this.isParticipant(conversation.id, userId);

      if (isParticipant) {
        result.push(conversation);
      }
    }

    return result;
  }

  async addParticipant(
    participant: ConversationParticipant,
  ): Promise<ConversationParticipant> {
    const conversationParticipants = this.participants.get(
      participant.conversationId,
    );

    if (!conversationParticipants) {
      throw new Error('CONVERSATION_NOT_FOUND');
    }

    conversationParticipants.push(participant);

    return participant;
  }

  async findParticipants(
    conversationId: string,
  ): Promise<ConversationParticipant[]> {
    return [...(this.participants.get(conversationId) ?? [])];
  }

  async isParticipant(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participants = this.participants.get(conversationId);

    if (!participants) {
      return false;
    }

    return participants.some((participant) => participant.userId === userId);
  }
}
