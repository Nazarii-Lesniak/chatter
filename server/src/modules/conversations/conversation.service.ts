import {
  createConversation,
  createConversationParticipant,
} from './conversation.factory';

import type { ConversationRepository } from './conversation.repository';
import type { Conversation } from './conversation.types';

export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createPrivateConversation(
    currentUserId: string,
    recipientUserId: string,
  ): Promise<Conversation> {
    if (currentUserId === recipientUserId) {
      throw new Error('CONVERSATION_REQUIRES_TWO_USERS');
    }

    const conversation = createConversation();

    await this.conversationRepository.create(conversation);

    await this.conversationRepository.addParticipant(
      createConversationParticipant(conversation.id, currentUserId),
    );

    await this.conversationRepository.addParticipant(
      createConversationParticipant(conversation.id, recipientUserId),
    );

    return conversation;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findByUserId(userId);
  }

  async getConversationById(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation =
      await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error('CONVERSATION_NOT_FOUND');
    }

    const isParticipant = await this.conversationRepository.isParticipant(
      conversationId,
      userId,
    );

    if (!isParticipant) {
      throw new Error('FORBIDDEN');
    }

    return conversation;
  }
}
