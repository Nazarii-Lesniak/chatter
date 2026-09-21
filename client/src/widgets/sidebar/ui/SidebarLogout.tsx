'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/entities/chat';
import { useAuthStore } from '@/entities/user';
import { socketClient } from '@/shared/api/socket';
import { Button } from '@/shared/ui/button/Button';

export function SidebarLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const resetChat = useChatStore((state) => state.reset);

  const handleLogout = () => {
    socketClient.disconnect();
    resetChat();
    logout();
    router.push('/login');
  };

  return (
    <Button variant="sidebar" onClick={handleLogout} aria-label="Logout">
      <LogOut />
    </Button>
  );
}
