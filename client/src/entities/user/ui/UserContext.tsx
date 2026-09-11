'use client';

import { createContext, useContext } from 'react';
import type { UserType } from '../model/types';

export const UserContext = createContext<{ user: UserType } | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('User subcomponents must be used within <UserContext>');
  }

  return context;
}
