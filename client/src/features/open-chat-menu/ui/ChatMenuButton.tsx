import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';

export function ChatMenuButton() {
  return (
    <Button variant="sidebar">
      <EllipsisVertical
        aria-label="Cheat menu button"
        className="text-chat-icon-action"
      />
    </Button>
  );
}
