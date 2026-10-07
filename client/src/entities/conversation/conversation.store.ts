import { create } from 'zustand';
import { conversationsApi } from '@/shared/api/conversations';
import type { Conversation, ConversationMessage } from './conversation.types';

type MobileView = 'contacts' | 'chat';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  mobileView: MobileView;
  isLoading: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => void;
  goBackToContacts: () => void;
  createConversation: (recipientId: string) => Promise<void>;
  updateLastMessage: (
    conversationId: string,
    message: ConversationMessage,
  ) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  mobileView: 'contacts',
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const conversations = await conversationsApi.getAll();

      const currentActiveId = get().activeConversationId;

      const activeConversationExists = conversations.some(
        (conversation) => conversation.id === currentActiveId,
      );

      set({
        conversations,
        activeConversationId: activeConversationExists
          ? currentActiveId
          : (conversations[0]?.id ?? null),
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load conversations',
        isLoading: false,
      });
    }
  },

  selectConversation: (conversationId) => {
    set({ activeConversationId: conversationId, mobileView: 'chat' });
  },

  goBackToContacts: () => {
    set({ activeConversationId: null, mobileView: 'contacts' });
  },

  createConversation: async (recipientId) => {
    set({ error: null });

    try {
      const conversation = await conversationsApi.create({ recipientId });

      set((state) => {
        const exists = state.conversations.some(
          (item) => item.id === conversation.id,
        );

        return {
          conversations: exists
            ? state.conversations
            : [conversation, ...state.conversations],
        };
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create conversation',
      });
    }
  },

  updateLastMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              lastMessage: message,
              updatedAt: message.createdAt,
            }
          : conversation,
      ),
    }));
  },
}));
