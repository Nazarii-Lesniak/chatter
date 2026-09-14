import { ChatList } from '@/widgets/chat-list/ChatList';
import { ChatWindow } from '@/widgets/chat-window/ui/ChatWindow';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';

export default function ChatPage() {
  return (
    <main className="grow h-dvh w-full flex p-2 gap-10 md:p-4 md:gap-4 lg:p-6 lg:gap-6 self-start">
      <Sidebar />
      <ChatList />
      <ChatWindow />
    </main>
  );
}
