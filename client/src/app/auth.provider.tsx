'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';
import { useAuthStore } from '@/entities/user/model/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const status = useAuthStore((state) => state.status);
  const pathname = usePathname();
  const router = useRouter();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    const isPublic = PUBLIC_PATHS.includes(pathname);

    if (status === 'unauthenticated' && !isPublic) {
      router.replace('/login');
    } else if (status === 'authenticated' && isPublic) {
      router.replace('/');
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-chat-background">
        <p className="text-sm text-chat-text-muted">Loading...</p>
      </div>
    );
  }

  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (status === 'unauthenticated' && !isPublic) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-chat-background">
        <p className="text-sm text-chat-text-muted">Redirecting to login...</p>
      </div>
    );
  }

  if (status === 'authenticated' && isPublic) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-chat-background">
        <p className="text-sm text-chat-text-muted">Loading...</p>
      </div>
    );
  }

  return children;
}
