import { Button } from '@/shared/ui/button/Button';
import { Bell, Home, MessageCircleMore, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Home' },
  { icon: MessageCircleMore, label: 'Messages' },
  { icon: Bell, label: 'Notifications' },
  { icon: Settings, label: 'Settings' },

];

export function SidebarNavigation() {
  return (
    <div className="flex flex-col gap-10">
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            return (
              <Button key={label} variant="sidebar">
                <Icon aria-label={label} />
              </Button>
            )
          })}
        </div>
  )
}