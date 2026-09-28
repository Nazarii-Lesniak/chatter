import { apiClient } from './api-client';

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationResponse {
  conversation: Conversation;
}

export interface ConversationsResponse {
  conversation: Conversation[];
}

export interface CreateConversationInput {
  recipientId: string;
}

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

    return response.conversation;
  },

  async getById(conversationId: string): Promise<Conversation> {
    const response = await apiClient<ConversationResponse>(
      `/conversations/${conversationId}`,
    );

    return response.conversation;
  },
};
