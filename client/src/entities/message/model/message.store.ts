import { create } from 'zustand';
import { type MessageDto, messagesApi } from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/get-error-message';

interface MessageState {
  messages: MessageDto[];
  isLoading: boolean;
  error: string | null;

  fetchMessages: (conversationId: string) => Promise<void>;
  appendMessage: (message: MessageDto) => void;
  setError: (error: string | null) => void;
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
        error: getErrorMessage(error, 'Failed to load messages'),
        isLoading: false,
      });
    }
  },

  appendMessage: (message) => {
    set((state) => {
      const isDuplicate = state.messages.some(
        (messageState) => messageState.id === message.id,
      );

      if (isDuplicate) {
        return state;
      }

      return {
        messages: [...state.messages, message],
      };
    });
  },

  setError: (error) => {
    set({
      error,
    });
  },

  clearMessages: () => {
    set({
      messages: [],
      error: null,
    });
  },
}));
