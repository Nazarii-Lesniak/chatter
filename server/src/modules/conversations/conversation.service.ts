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
    firstUserId: string,
    secondUserId: string,
  ): Promise<Conversation> {
    if (firstUserId === secondUserId) {
      throw new Error('CONVERSATION_REQUIRES_TWO_USERS');
    }

    const conversation = createConversation();

    await this.conversationRepository.create(conversation);

    await this.conversationRepository.addParticipant(
      createConversationParticipant(conversation.id, firstUserId),
    );

    await this.conversationRepository.addParticipant(
      createConversationParticipant(conversation.id, secondUserId),
    );

    return conversation;
  }
}
