'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useChatStore } from '@/entities/chat';
import { useAuthStore } from '@/entities/user';
import { ChatList } from '@/widgets/chat-list';
import { ChatWindow } from '@/widgets/chat-window';
import { Sidebar } from '@/widgets/sidebar';

export default function ChatPage() {
  const router = useRouter();
  const { userId, isAuthenticated } = useAuthStore();
  const initSocket = useChatStore((state) => state.initSocket);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      router.push('/login');
      return;
    }

    initSocket(userId);
  }, [isAuthenticated, userId, initSocket, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center text-chat-text-muted">
        Redirecting…
      </div>
    );
  }

  return (
    <main className="grow h-dvh w-full flex p-2 gap-10 md:p-4 md:gap-4 lg:p-6 lg:gap-6 self-start">
      <Sidebar />
      <ChatList />
      <ChatWindow />
    </main>
  );
}
