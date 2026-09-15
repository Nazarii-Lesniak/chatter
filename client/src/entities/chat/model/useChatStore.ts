import { create } from 'zustand';
import type { UserType } from '@/entities/user/model/types';

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

  setActiveChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [
    {
      id: '1',
      username: 'Anil',
      avatarUrl: '',
      lastMessage: 'April fool’s day',
      lastMessageTime: 'Today, 9.52pm',
      createdAt: 'Today, 9.52pm',
      unreadCount: 0,
      status: 'online',
    },
    {
      id: '2',
      username: 'Chuutiya',
      avatarUrl: '',
      lastMessage: 'Baag',
      lastMessageTime: 'Today, 12.11pm',
      createdAt: 'Today, 9.52pm',
      lastSeen: ' - Last seen, 2.02pm',
      unreadCount: 1,
      status: 'offline',
    },
  ],
  activeChatId: '1',
  messages: {
    '1': [
      {
        id: 'm2',
        text: 'How are you?',
        senderId: '1',
        timestamp: 'Today, 8.30pm',
      },
      { id: 'm3', text: 'Hello!', senderId: 'me', timestamp: 'Today, 8.33pm' },
      {
        id: 'm1',
        text: 'Hey There!',
        senderId: '1',
        timestamp: 'Today, 8.30pm',
      },
      {
        id: 'm4',
        text: 'I am fine and how are you?',
        senderId: 'me',
        timestamp: 'Today, 8.34pm',
      },
    ],
    '2': [],
  },
  isConnected: false,

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  addMessage: (chatId, newMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
    })),

  setConnectionStatus: (status) => set({ isConnected: status }),
}));
