import { Button } from '@/shared/ui/button/Button';
import { LogOut } from 'lucide-react';

export function SidebarLogout() {
  return (
    <Button variant="sidebar">
      <LogOut aria-label="Logout" />
    </Button>
  )
}