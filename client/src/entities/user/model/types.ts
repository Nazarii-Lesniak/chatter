export type UserStatus = 'online' | 'offline';

export interface UserType {
  id: string;
  username: string;
  avatarUrl?: string;
  status: UserStatus;
  lastSeen?: string;
  createdAt: string;
}
