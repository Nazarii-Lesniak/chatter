import { Bell, Home, LogOut, MessageCircleMore, Settings } from 'lucide-react';
import SearchInput from '@/features/search-by-name/ui/SearchInput';
import MessageInput from '@/features/send-message/MessageInput';
import { Button } from '@/shared/ui/button/Button';

export default function ChatPage() {
  return (
    <main className="flex justify-center items-center gap-10 container">
      <div className="flex flex-col h-dvh w-34 pt-8 pb-10 bg-chat-sidebar rounded-3xl items-center justify-between">
        <div className="flex flex-col gap-14">
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

        <Button variant="sidebar">
          <LogOut aria-label="Logout" />
        </Button>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-10">
        <SearchInput />
        <MessageInput />
      </div>
    </main>
  );
}
