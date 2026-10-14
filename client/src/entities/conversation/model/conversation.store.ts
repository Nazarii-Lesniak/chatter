import { create } from 'zustand';
import {
  type ConversationDto,
  conversationsApi,
  type MessageDto,
} from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/get-error-message';

interface FetchOptions {
  silent?: boolean;
}

interface ConversationState {
  conversations: ConversationDto[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchConversations: (options?: FetchOptions) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  closeConversation: () => void;
  startConversation: (recipientId: string) => Promise<void>;
  updateLastMessage: (message: MessageDto) => void;
  reset: () => void;
}

const initialState = {
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  error: null,
};

function byMostRecent(a: ConversationDto, b: ConversationDto) {
  return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  ...initialState,

  fetchConversations: async ({ silent = false } = {}) => {
    if (!silent) {
      set({ isLoading: true, error: null });
    }

    try {
      const conversations = await conversationsApi.getAll();
      const { activeConversationId } = get();

      set({
        conversations,
        isLoading: false,
        activeConversationId: conversations.some(
          (conversation) => conversation.id === activeConversationId,
        )
          ? activeConversationId
          : null,
      });
    } catch (error) {
      if (!silent) {
        set({
          error: getErrorMessage(error, 'Failed to load conversations'),
          isLoading: false,
        });
      }
    }
  },

  selectConversation: (conversationId) =>
    set({ activeConversationId: conversationId }),

  closeConversation: () => set({ activeConversationId: null }),

  startConversation: async (recipientId) => {
    const conversation = await conversationsApi.create({ recipientId });

    set((state) => ({
      activeConversationId: conversation.id,
      conversations: state.conversations.some(
        (existing) => existing.id === conversation.id,
      )
        ? state.conversations
        : [conversation, ...state.conversations],
    }));
  },

  updateLastMessage: (message) =>
    set((state) => ({
      conversations: state.conversations
        .map((conversation) =>
          conversation.id === message.conversationId
            ? {
                ...conversation,
                lastMessage: message,
                updatedAt: message.createdAt,
              }
            : conversation,
        )
        .sort(byMostRecent),
    })),

  reset: () => set(initialState),
}));

export function useActiveConversation(): ConversationDto | undefined {
  return useConversationStore((state) =>
    state.conversations.find(
      (conversation) => conversation.id === state.activeConversationId,
    ),
  );
}

export function useIsConversationOpen(): boolean {
  return useConversationStore((state) => state.activeConversationId !== null);
}
