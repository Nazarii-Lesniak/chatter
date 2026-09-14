'use client';

import { Message } from '@/entities/message/ui';
import { ChatHeader } from '@/widgets/chat-header/ui/ChatHeader';
import MessageInput from '../../../features/send-message/ui/MessageInput';

export function ChatWindow() {
  return (
    <div className="flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow">
      <ChatHeader />

      <Message variant="companion" className="flex self-start">
        <Message.Bubble>
          Hy there!Hy there!Hy there!Hy there!Hy there!Hy there!Hy there!Hy
          there!Hy there!Hy there!Hy there!Hy there!Hy there!Hy there!Hy there!
        </Message.Bubble>
        <Message.Bubble>How are you?</Message.Bubble>
        <Message.Timestamp>Today, 8.30pm</Message.Timestamp>
      </Message>
      <Message variant="own" className="flex self-end items-end">
        <Message.Bubble>Hello!</Message.Bubble>
        <Message.Bubble>I am fine and how are you?</Message.Bubble>
        <Message.Timestamp>Today, 8.33pm</Message.Timestamp>
      </Message>

      <MessageInput />
    </div>
  );
}
