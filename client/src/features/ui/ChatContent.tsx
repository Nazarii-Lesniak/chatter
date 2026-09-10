'use client';

import { Message } from '@/entities/message/ui/Message';

export function ChatContent() {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-10 max-w-2xl">
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
    </div>
  );
}
