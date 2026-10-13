import { create } from 'zustand';
import {
  type ConversationDto,
  conversationsApi,
  type MessageDto,
} from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/get-error-message';

type MobileView = 'contacts' | 'chat';

interface ConversationState {
  conversations: ConversationDto[];
  activeConversationId: string | null;
  mobileView: MobileView;
  isLoading: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => void;
  goBackToContacts: () => void;
  createConversation: (recipientId: string) => Promise<void>;
  updateLastMessage: (conversationId: string, message: MessageDto) => void;
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
        activeConversationId: activeConversationExists ? currentActiveId : null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Failed to load conversations'),
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
        error: getErrorMessage(error, 'Failed to create conversation'),
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
