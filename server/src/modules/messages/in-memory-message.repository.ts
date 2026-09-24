import type { MessageRepository } from './message.repository';
import type { Message } from './message.types';

export class InMemoryMessageRepository implements MessageRepository {
  private readonly messages = new Map<string, Message>();

  async create(message: Message): Promise<Message> {
    this.messages.set(message.id, message);

    return message;
  }

  async findById(id: string): Promise<Message | null> {
    return this.messages.get(id) ?? null;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
  }
}
