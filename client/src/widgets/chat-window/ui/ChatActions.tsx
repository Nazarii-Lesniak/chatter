import { EllipsisVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function ChatActions() {
  return (
    <div className="flex items-center gap-2 md:gap-4 lg:gap-5">
      <Button variant="action" aria-label="Call" disabled title="Coming soon">
        <Phone aria-hidden="true" />
      </Button>
      <Button
        variant="action"
        aria-label="Video call"
        disabled
        title="Coming soon"
      >
        <Video aria-hidden="true" />
      </Button>
      <Button
        variant="action"
        aria-label="More options"
        disabled
        title="Coming soon"
      >
        <EllipsisVertical aria-hidden="true" />
      </Button>
    </div>
  );
}
