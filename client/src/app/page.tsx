'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useChatStore } from '@/entities/chat';
import { ChatList } from '@/widgets/chat-list';
import { ChatWindow } from '@/widgets/chat-window';
import { Sidebar } from '@/widgets/sidebar';

function ChatContent() {
  const searchParams = useSearchParams();
  const initSocket = useChatStore((state) => state.initSocket);
  const userId = searchParams.get('user') || '';

  useEffect(() => {
    initSocket(userId);
  }, [userId, initSocket]);

  return (
    <main className="grow h-dvh w-full flex p-2 gap-10 md:p-4 md:gap-4 lg:p-6 lg:gap-6 self-start">
      <Sidebar />
      <ChatList />
      <ChatWindow />
    </main>
  );
}
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Завантаження...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
