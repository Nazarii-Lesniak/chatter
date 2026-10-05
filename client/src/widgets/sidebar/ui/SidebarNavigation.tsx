import { Bell, Home, MessageCircleMore, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';

const NAV_ITEMS = [
  { icon: Home, label: 'Home' },
  { icon: MessageCircleMore, label: 'Messages' },
  { icon: Bell, label: 'Notifications' },
  { icon: Settings, label: 'Settings' },
];

export function SidebarNavigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col gap-6 items-center">
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          return (
            <li key={label}>
              <Button variant="sidebar" aria-label={label}>
                <Icon aria-hidden="true" />
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
