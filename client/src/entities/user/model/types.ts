export type UserStatus = 'online' | 'offline';
export type UserVariant = 'chatWindow' | 'chatList';

export interface UserType {
  id: string;
  username: string;
  avatarUrl?: string;
  status: UserStatus;
  lastSeen?: string;
  createdAt: string;
  unreadCount?: number;
}

export interface UserContextProps {
  user: UserType;
  variant: UserVariant;
}

// interface User {
//   id: string;
//   username: string;
//   avatarUrl?: string;
//   createdAt: string;
// }

// interface Conversation {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Message {
//   id: string;
//   conversationId: string;
//   senderId: string;
//   content: string;
//   createdAt: string;
// }