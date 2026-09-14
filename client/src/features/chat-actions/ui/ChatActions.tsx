import { EllipsisVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';

export function ChatActions() {
  return (
    <div className="flex items-center gap-2 md:gap-4 lg:gap-5">
      <Button variant="sidebar">
        <Phone aria-label="Call button" className="text-chat-icon-action" />
      </Button>
      <Button variant="sidebar">
        <Video
          aria-label="Video call button"
          className="text-chat-icon-action"
        />
      </Button>
      <Button variant="sidebar">
        <EllipsisVertical
          aria-label="Cheat menu button"
          className="text-chat-icon-action"
        />
      </Button>
    </div>
  );
}
