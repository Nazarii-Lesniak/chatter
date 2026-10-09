'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user';
import { Button } from '@/shared/ui/button/Button';

export function SidebarLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();

    router.replace('/login');
  };

  return (
    <Button variant="sidebar" aria-label="Logout" onClick={handleLogout}>
      <LogOut aria-hidden="true" />
    </Button>
  );
}
