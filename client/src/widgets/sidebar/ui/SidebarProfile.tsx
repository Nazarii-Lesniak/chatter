import { Button } from '@/shared/ui/button/Button';
import { UserRound } from 'lucide-react';

export function SidebarProfile() {
  return (
    <Button variant="sidebar">
      <UserRound aria-label="Username" />
    </Button>
  )
}