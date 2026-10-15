'use client';

import { useState } from 'react';
import { ChatList } from '@/widgets/chat-list';
import { ChatWindow } from '@/widgets/chat-window';
import { Sidebar } from '@/widgets/sidebar';
import { useChatRealtime } from '../model/useChatRealtime';

export function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isConnected, sendMessage } = useChatRealtime();

  return (
    <main className="grow h-dvh w-full flex p-2 gap-2 md:p-4 md:gap-4 lg:p-6 lg:gap-6">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ChatList onOpenSidebar={() => setIsSidebarOpen(true)} />
      <ChatWindow isConnected={isConnected} onSendMessage={sendMessage} />
    </main>
  );
}
