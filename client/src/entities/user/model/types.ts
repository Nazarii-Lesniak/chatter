export type UserStatus = 'online' | 'offline';
export type UserVariant = 'chatWindow' | 'chatList';

export interface UserType {
  id: string;
  username: string;
  avatarUrl?: string;
  status: UserStatus;
  lastSeen?: string;
  createdAt: string;
}

export interface UserContextProps {
  user: UserType;
  variant: UserVariant;
}
