import {
  Bell,
  Home,
  LogOut,
  MessageCircleMore,
  Settings,
  UserRound,
} from 'lucide-react';

import { Button } from '@/shared/ui/button/Button';

export function Sidebar() {
  return (
    <div className="flex flex-col h-full pt-8 pb-10 bg-chat-sidebar rounded-3xl items-center justify-between">
      <div className="flex flex-col items-center gap-20 w-25">
        <Button variant="sidebar">
          <UserRound aria-label="Username" />
        </Button>

        <div className="flex flex-col gap-10">
          <Button variant="sidebar">
            <Home aria-label="Home" />
          </Button>

          <Button variant="sidebar">
            <MessageCircleMore aria-label="Messages" />
          </Button>

          <Button variant="sidebar">
            <Bell aria-label="Notifications" />
          </Button>

          <Button variant="sidebar">
            <Settings aria-label="Settings" />
          </Button>
        </div>
      </div>

      <Button variant="sidebar">
        <LogOut aria-label="Logout" />
      </Button>
    </div>
  );
}
