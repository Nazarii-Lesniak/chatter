import { apiClient } from './api-client';
import type { MessageDto } from './types';

export const messagesApi = {
  async getByConversation(
    conversationId: string,
    signal?: AbortSignal,
  ): Promise<MessageDto[]> {
    const { messages } = await apiClient<{ messages: MessageDto[] }>(
      `/conversations/${encodeURIComponent(conversationId)}/messages`,
      { signal },
    );

    return messages;
  },
};
