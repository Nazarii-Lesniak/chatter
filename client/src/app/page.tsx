import { ChatList } from '@/widgets/chat-list/ChatList';
import { ChatWindow } from '@/widgets/chat-window/ui/ChatWindow';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';

export default function ChatPage() {
  return (
    <main className="flex grow h-dvh self-start gap-10 p-10 w-full">
      <Sidebar />
      <ChatList />
      <ChatWindow />
    </main>
  );
}
