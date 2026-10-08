import type {
  Conversation,
  ConversationResponse,
  ConversationsResponse,
  CreateConversationInput,
} from '@/shared/api/types/conversation.types';
import { apiClient } from './api-client';

export const conversationsApi = {
  async create(input: CreateConversationInput): Promise<Conversation> {
    const response = await apiClient<ConversationResponse>('/conversations', {
      method: 'POST',
      body: input,
    });

    return response.conversation;
  },

  async getAll(): Promise<Conversation[]> {
    const response = await apiClient<ConversationsResponse>('/conversations');

    return response.conversations;
  },

  async getById(conversationId: string): Promise<Conversation> {
    const response = await apiClient<ConversationResponse>(
      `/conversations/${conversationId}`,
    );

    return response.conversation;
  },
};
