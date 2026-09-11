import { Button } from '@/shared/ui/button/Button';
import { Phone } from 'lucide-react';

export function CallButton() {
  return (
    <Button variant="sidebar">
      <Phone aria-label="Call button" className='text-chat-icon-action'/>
    </Button>
  )
}