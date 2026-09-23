'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';

export function SidebarLogout() {
  return (
    <Button variant="sidebar" aria-label="Logout">
      <LogOut />
    </Button>
  );
}
