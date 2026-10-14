'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/entities/user';
import { PUBLIC_ROUTES, ROUTES } from '@/shared/config';
import { FullScreen } from '@/shared/ui/full-screen';
import { Spinner } from '@/shared/ui/spinner';
import { ConnectingScreen } from './ConnectingScreen';
import { ConnectionErrorScreen } from './ConnectionErrorScreen';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const status = useAuthStore((state) => state.status);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname ?? '');

  const redirectTarget =
    status === 'unauthenticated' && !isPublicRoute
      ? ROUTES.login
      : status === 'authenticated' && isPublicRoute
        ? ROUTES.home
        : null;

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [redirectTarget, router]);

  if (status === 'loading') {
    return <ConnectingScreen />;
  }

  if (status === 'error') {
    return <ConnectionErrorScreen onRetry={() => void initializeAuth()} />;
  }

  if (redirectTarget) {
    return (
      <FullScreen>
        <Spinner />
      </FullScreen>
    );
  }

  return children;
}
