import type { ConversationRepository } from '../conversations/conversation.repository';
import { createMessage } from './message.factory';
import type { MessageRepository } from './message.repository';
import type { Message } from './message.types';

export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async sendMessage(
    senderId: string,
    conversationId: string,
    content: string,
  ): Promise<Message> {
    const conversation =
      await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error('CONVERSATION_NOT_FOUND');
    }

    const isParticipant = await this.conversationRepository.isParticipant(
      conversationId,
      senderId,
    );

    if (!isParticipant) {
      throw new Error('FORBIDDEN');
    }

    const normalizedContent = content.trim();

    if (!normalizedContent) {
      throw new Error('MESSAGE_CONTENT_EMPTY');
    }

    const message = createMessage(conversationId, senderId, normalizedContent);

    return this.messageRepository.create(message);
  }
}
