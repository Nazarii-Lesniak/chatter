'use client';

import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/entities/user';
import { Button } from '@/shared/ui/button';

export function SidebarLogout() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Button variant="sidebar" aria-label="Logout" onClick={() => void logout()}>
      <LogOut aria-hidden="true" />
    </Button>
  );
}
