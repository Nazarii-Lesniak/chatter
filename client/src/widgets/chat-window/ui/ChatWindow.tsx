'use client';

import { useConversationStore } from '@/entities/conversation';
import { cn } from '@/shared/lib/class-merge';
import { ChatMessageInput } from './ChatMessageInput';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatWindowHeader } from './ChatWindowHeader';

export function ChatWindow() {
  const mobileView = useConversationStore((state) => state.mobileView);

  return (
    <div
      className={cn(
        'flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow',
        mobileView === 'contacts'
          ? 'hidden md:flex'
          : 'flex animate-slide-in-right md:animate-none',
      )}
    >
      <ChatWindowHeader />
      <ChatMessagesList />
      <ChatMessageInput />
    </div>
  );
}
