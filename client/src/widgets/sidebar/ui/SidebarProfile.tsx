import { UserRound } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';

export function SidebarProfile() {
  return (
    <Button variant="sidebar">
      <UserRound aria-label="Username" />
    </Button>
  );
}
