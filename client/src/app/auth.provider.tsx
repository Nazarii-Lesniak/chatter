'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { useAuthStore } from '@/entities/user/model/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const status = useAuthStore((state) => state.status);

  const initializadRef = useRef(false);

  useEffect(() => {
    if (initializadRef.current) {
      return;
    }

    initializadRef.current = true;

    initializeAuth();
  }, [initializeAuth]);

  if (status === 'loading') {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-chat-background">
        <p className="text-sm text-chat-text-muted">Loading...</p>
      </div>
    );
  }

  return children;
}
