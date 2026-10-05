import { EllipsisVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';

export function ChatActions() {
  return (
    <div className="flex items-center gap-2 md:gap-4 lg:gap-5">
      <Button variant="action" aria-label="Call">
        <Phone aria-hidden="true" />
      </Button>
      <Button variant="action" aria-label="Video call">
        <Video aria-hidden="true" />
      </Button>
      <Button variant="action" aria-label="More options">
        <EllipsisVertical aria-hidden="true" />
      </Button>
    </div>
  );
}
