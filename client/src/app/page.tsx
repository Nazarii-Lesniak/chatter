import SearchInput from '@/features/search-by-name/ui/SearchInput';
import MessageInput from '@/features/send-message/MessageInput';

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center gap-10">
      <h1>Chatter</h1>
      <SearchInput />
      <MessageInput />
    </main>
  );
}
