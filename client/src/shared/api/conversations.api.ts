import { apiClient } from './api-client';
import type { ConversationDto } from './types';

interface CreateConversationInput {
  recipientId: string;
}

export const conversationsApi = {
  async create(input: CreateConversationInput): Promise<ConversationDto> {
    const { conversation } = await apiClient<{
      conversation: ConversationDto;
    }>('/conversations', { method: 'POST', body: input });

    return conversation;
  },

  async getAll(): Promise<ConversationDto[]> {
    const { conversations } = await apiClient<{
      conversations: ConversationDto[];
    }>('/conversations');

    return conversations;
  },

  async getById(conversationId: string): Promise<ConversationDto> {
    const { conversation } = await apiClient<{
      conversation: ConversationDto;
    }>(`/conversations/${encodeURIComponent(conversationId)}`);

    return conversation;
  },
};
