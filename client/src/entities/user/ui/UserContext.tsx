'use client';

import { createContext, useContext } from 'react';
import type { UserContextProps } from '../model/types';

export const UserContext = createContext<UserContextProps | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('User subcomponents must be used within <UserContext>');
  }

  return context;
}
