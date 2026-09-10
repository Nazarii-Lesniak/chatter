import SearchInput from '@/features/search-by-name/ui/SearchInput';
import MessageInput from '@/features/send-message/MessageInput';
import { ChatContent } from '@/features/ui/ChatContent';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';

export default function ChatPage() {
  return (
    <main className="flex grow h-dvh self-start gap-10 p-10 w-full">
      <Sidebar />
      <SearchInput />
      <div className="flex flex-col h-full flex-1 justify-between items-center gap-10">
        <ChatContent />
        <MessageInput />
      </div>
    </main>
  );
}
