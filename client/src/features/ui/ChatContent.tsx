'use client';

import { Message } from '@/entities/message/ui/message';
import { User } from '@/entities/user/ui';
import type { IUser } from '@/entities/user/ui/UserContext';

export function ChatContent() {
  const userData: IUser = {
    id: '1',
    username: 'John Doe',
    status: 'online' as const,
    lastSeen: ' - Last seen, 2.02pm',
  };

  return (
    <div className="flex flex-col w-full items-stretch justify-center gap-10 max-w-full">
      <User user={userData}>
        <User.Avatar />
        <div className="flex flex-col">
          <User.Username />
          <User.LastSeen />
        </div>
      </User>
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
