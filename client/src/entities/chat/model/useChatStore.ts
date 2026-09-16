import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserType } from '@/entities/user/model/types';
import { socketClient } from '@/shared/api/socket';
import type { SocketEvent } from '../../../../../server/src/types';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

interface Chat extends UserType {
  id: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'offline';
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Record<string, Message[]>;
  isConnected: boolean;
  currentUserId: string | null;

  setActiveChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  setConnectionStatus: (status: boolean) => void;

  initSocket: (userId: string) => void;
  sendMessage: (text: string) => void;
}

let socketUnsubscribe: (() => void) | null = null;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: '',
      messages: {
        '': [],
      },
      isConnected: false,
      currentUserId: null,

      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      addMessage: (chatId, newMessage) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), newMessage],
          },
        })),

      setConnectionStatus: (status) => set({ isConnected: status }),

      initSocket: (userId) => {
        set({ currentUserId: userId });

        socketClient.connect(userId);

        if (socketUnsubscribe) {
          socketUnsubscribe();
        }

        socketUnsubscribe = socketClient.onMessage((event: SocketEvent) => {
          switch (event.type) {
            case 'NEW_MESSAGE': {
              const { chatId, id, text, senderId, timestamp } = event.payload;
              get().addMessage(chatId, { id, text, senderId, timestamp });
              break;
            }
            case 'USER_STATUS': {
              const { userId, status } = event.payload;
              set((state) => ({
                chats: state.chats.map((chat) =>
                  chat.id === userId ? { ...chat, status } : chat,
                ),
              }));
              break;
            }
          }
        });
      },

      sendMessage: (text) => {
        const { activeChatId, currentUserId } = get();
        if (!activeChatId || !currentUserId) return;
        socketClient.send({
          type: 'SEND_MESSAGE',
          payload: {
            chatId: activeChatId,
            text,
            senderId: currentUserId,
          },
        });
      },
    }),
    {
      name: 'chatter-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
        activeChatId: state.activeChatId,
      }),
    },
  ),
);
