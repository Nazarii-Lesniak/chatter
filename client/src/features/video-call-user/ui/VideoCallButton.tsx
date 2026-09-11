import { Button } from '@/shared/ui/button/Button';
import { Video } from 'lucide-react';

export function VideoCallButton() {
  return (
    <Button variant="sidebar">
      <Video aria-label="Video call button" className='text-chat-icon-action'/>
    </Button>
  )
}