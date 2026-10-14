import { create } from 'zustand';
import { type MessageDto, messagesApi } from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/get-error-message';

interface FetchOptions {
  silent?: boolean;
}

interface MessageState {
  conversationId: string | null;
  messages: MessageDto[];
  isLoading: boolean;
  error: string | null;
  sendError: string | null;

  fetchMessages: (
    conversationId: string,
    options?: FetchOptions,
  ) => Promise<void>;

  appendMessage: (message: MessageDto) => void;
  setSendError: (message: string | null) => void;
  reset: () => void;
}

const initialState = {
  conversationId: null,
  messages: [],
  isLoading: false,
  error: null,
  sendError: null,
};

function mergeById(fetched: MessageDto[], live: MessageDto[]) {
  const knownIds = new Set(fetched.map((message) => message.id));

  return [...fetched, ...live.filter((message) => !knownIds.has(message.id))];
}

export const useMessageStore = create<MessageState>((set, get) => ({
  ...initialState,

  fetchMessages: async (conversationId, { silent = false } = {}) => {
    if (silent) {
      if (get().conversationId !== conversationId) {
        return;
      }
    } else {
      set({ ...initialState, conversationId, isLoading: true });
    }

    try {
      const fetched = await messagesApi.getByConversation(conversationId);

      if (get().conversationId !== conversationId) {
        return;
      }

      set((state) => ({
        messages: mergeById(fetched, state.messages),
        isLoading: false,
      }));
    } catch (error) {
      if (silent || get().conversationId !== conversationId) {
        return;
      }

      set({
        error: getErrorMessage(error, 'Failed to load messages'),
        isLoading: false,
      });
    }
  },

  appendMessage: (message) =>
    set((state) => {
      if (
        message.conversationId !== state.conversationId ||
        state.messages.some((existing) => existing.id === message.id)
      ) {
        return state;
      }

      return { messages: [...state.messages, message] };
    }),

  setSendError: (sendError) => set({ sendError }),

  reset: () => set(initialState),
}));
