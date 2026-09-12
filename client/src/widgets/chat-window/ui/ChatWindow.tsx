'use client';

import { Message } from '@/entities/message/ui';
import { ChatHeader } from '@/widgets/chat-header/ui/ChatHeader';
import MessageInput from '../../../features/send-message/ui/MessageInput';

export function ChatWindow() {
  return (
    <div className="flex flex-col w-full h-full bg-white p-9 items-stretch justify-between gap-10 max-w-full rounded-3xl shadow-input-glow">
      <ChatHeader />

      <Message variant="companion" className="flex self-start">
        <Message.Bubble>Hy there!</Message.Bubble>
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
