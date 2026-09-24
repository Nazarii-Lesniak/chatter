import type { Message } from './message.types';

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByConversationId(conversationId: string): Promise<Message[]>;
}
