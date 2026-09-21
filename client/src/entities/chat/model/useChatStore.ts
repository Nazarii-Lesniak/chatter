import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserType } from '@/entities/user/model/types';
import { socketClient } from '@/shared/api/socket';
import type { SocketEvent } from '@/shared/types/socket';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

export interface Chat extends UserType {
  id: string;
  unreadCount: number;
}

export interface SearchUser {
  userId: string;
  username: string;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Record<string, Message[]>;
  isConnected: boolean;
  currentUserId: string | null;
  searchResults: SearchUser[];

  setActiveChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  setConnectionStatus: (status: boolean) => void;
  setSearchResults: (results: SearchUser[]) => void;
  clearSearchResults: () => void;

  openChat: (targetUser: SearchUser) => void;

  initSocket: (userId: string) => void;
  sendMessage: (text: string) => void;
}

let socketUnsubscribe: (() => void) | null = null;

export function buildChatId(userA: string, userB: string) {
  return [userA, userB].sort().join('_');
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      messages: {},
      isConnected: false,
      currentUserId: null,
      searchResults: [],

      setActiveChat: (chatId) =>
        set((state) => ({
          activeChatId: chatId,
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
          ),
        })),

      addMessage: (chatId, newMessage) =>
        set((state) => {
          const isActive = state.activeChatId === chatId;

          return {
            messages: {
              ...state.messages,
              [chatId]: [...(state.messages[chatId] ?? []), newMessage],
            },
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    lastSeen: newMessage.timestamp,
                    unreadCount: isActive ? 0 : chat.unreadCount + 1,
                  }
                : chat,
            ),
          };
        }),

      setConnectionStatus: (status) => set({ isConnected: status }),

      setSearchResults: (results) => set({ searchResults: results }),

      clearSearchResults: () => set({ searchResults: [] }),

      openChat: (targetUser) => {
        const { currentUserId, chats } = get();

        if (!currentUserId) {
          return;
        }

        const chatId = buildChatId(currentUserId, targetUser.userId);

        const alreadyExists = chats.some((chat) => chat.id === chatId);

        if (!alreadyExists) {
          const newChat: Chat = {
            id: chatId,
            username: targetUser.username,
            status: 'offline',
            createdAt: '',
            unreadCount: 0,
          };

          set((state) => ({ chats: [...state.chats, newChat] }));
        }

        socketClient.send({
          type: 'JOIN_CHAT',
          payload: { chatId, userId: currentUserId },
        });

        socketClient.send({
          type: 'JOIN_CHAT',
          payload: { chatId, userId: targetUser.userId },
        });

        set({ activeChatId: chatId });
        get().clearSearchResults();
      },

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
              const { userId: uid, status } = event.payload;

              set((state) => ({
                chats: state.chats.map((chat) => {
                  const chatUserId = chat.id
                    .split('_')
                    .find((id) => id !== state.currentUserId);
                  return chatUserId === uid ? { ...chat, status } : chat;
                }),
              }));
              break;
            }

            case 'SEARCH_RESULT': {
              get().setSearchResults(event.payload.users);
              break;
            }

            default:
              break;
          }
        });
      },

      sendMessage: (text) => {
        const { activeChatId, currentUserId } = get();

        if (!activeChatId || !currentUserId) {
          return;
        }

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
