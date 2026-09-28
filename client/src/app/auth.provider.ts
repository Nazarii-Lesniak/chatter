'use client';

import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/entities/user/model/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
}
