import { apiClient } from './api-client';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessagesResponse {
  messages: Message[];
}

export const messagesApi = {
  async getByConversation(conversationId: string): Promise<Message[]> {
    const response = await apiClient<MessagesResponse>(`/conversations/${conversationId}/messages`);

    return response.messages;
  }
}

