import type { MessageRepository } from '../messages/message.repository';
import { toPublicUser } from '../users/user.dto';
import type { UserRepository } from '../users/user.repository';
import type { ConversationView } from './conversation.dto';
import {
  createConversation,
  createConversationParticipant,
} from './conversation.factory';

import type { ConversationRepository } from './conversation.repository';
import type { Conversation } from './conversation.types';

export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserRepository,
    private readonly messageRepository?: MessageRepository,
  ) {}

  async createPrivateConversation(
    currentUserId: string,
    recipientUserId: string,
  ): Promise<Conversation> {
    if (currentUserId === recipientUserId) {
      throw new Error('CONVERSATION_REQUIRES_TWO_USERS');
    }

    const recipient = await this.userRepository.findById(recipientUserId);

    if (!recipient) {
      throw new Error('USER_NOT_FOUND');
    }

    const existingConversation =
      await this.conversationRepository.findPrivateConversation(
        currentUserId,
        recipientUserId,
      );

    if (existingConversation) {
      return existingConversation;
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
    const conversations =
      await this.conversationRepository.findByUserId(userId);

    return Promise.all(
      conversations.map((conversation) =>
        this.toConversationView(conversation, userId),
      ),
    );
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

    return this.toConversationView(conversation, userId);
  }

  private async toConversationView(
    conversation: Conversation,
    currentUserId: string,
  ): Promise<ConversationView> {
    const participants = await this.conversationRepository.findParticipants(
      conversation.id,
    );

    const recipient = participants.find(
      (participant) => participant.userId !== currentUserId,
    );

    if (!recipient) {
      throw new Error('CONVERSATION_PARTICIPANT_NOT_FOUND');
    }

    const user = await this.userRepository.findById(recipient.userId);

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const lastMessage = this.messageRepository
      ? await this.messageRepository.findLastMessageByConversationId(
          conversation.id,
        )
      : null;

    return {
      ...conversation,
      participant: toPublicUser(user),
      lastMessage,
    };
  }
}
