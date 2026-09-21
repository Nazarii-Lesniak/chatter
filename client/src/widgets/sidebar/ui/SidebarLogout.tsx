'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user';
import { socketClient } from '@/shared/api/socket';
import { Button } from '@/shared/ui/button/Button';

export function SidebarLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    socketClient.disconnect();
    logout();
    router.push('/login');
  };

  return (
    <Button variant="sidebar" onClick={handleLogout} aria-label="Logout">
      <LogOut />
    </Button>
  );
}
