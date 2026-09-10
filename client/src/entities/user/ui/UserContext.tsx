'use client';

import { createContext, useContext } from 'react';

type TUserStatus = 'online' | 'offline';

export interface IUser {
  id: string;
  username: string;
  avatarUrl?: string;
  status: TUserStatus;
  lastSeen?: string;
}

interface IUserContextType {
  user: IUser;
}

export const UserContext = createContext<IUserContextType | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('User subcomponents must be used within <User>');
  }

  return context;
}
