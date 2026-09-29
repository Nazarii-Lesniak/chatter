import { create } from 'zustand';
import { type Message, messagesApi } from '@/shared/api/messages';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  fetchMessages: (conversationId: string) => Promise<void>;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async (conversationId) => {
    set({
      messages: [],
      isLoading: true,
      error: null,
    });

    try {
      const messages = await messagesApi.getByConversation(conversationId);

      set({
        messages,
        isLoading: false,
      });
    } catch (error) {
      set({
        messages: [],
        error:
          error instanceof Error ? error.message : 'Failed to load messages',
        isLoading: false,
      });
    }
  },

  clearMessages: () => {
    set({
      messages: [],
      error: null,
    });
  },
}));
