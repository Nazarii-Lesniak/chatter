export type UserStatus = 'online' | 'offline';

export type UserVariant = 'default' | 'compact';

export interface UserSummary {
  id: string;
  username: string;
  status?: UserStatus;
  lastMessage?: string;
  timestamp?: string;
}

export interface UserContextProps {
  user: UserSummary;
  variant: UserVariant;
}
