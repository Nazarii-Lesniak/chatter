import { create } from 'zustand';
import { conversationsApi } from '@/shared/api/conversations';
import type { Conversation } from './conversation.types';

interface ConversationState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  isLoading: false,
  error: null,

  fetchConversations: async() => {
    set({ 
      isLoading: true,
      error: null,
    });

    try {
      const conversations = await conversationsApi.getAll();
      
      set({
        conversations,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load conversations',
        isLoading: false,
      })
    }
  },
}))