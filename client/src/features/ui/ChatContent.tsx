'use client';

import { Message } from '@/entities/message/ui/message';
import type { UserType } from '@/entities/user/model/types';
import { User } from '@/entities/user/ui';

export function ChatContent() {
  const userData: UserType = {
    id: '1',
    username: 'John Doe',
    status: 'offline' as const,
    lastSeen: ' - Last seen, 2.02pm',

    createdAt: 'Today, 9.52pm',
  };

  return (
    <div className="flex flex-col w-full items-stretch justify-center gap-10 max-w-full">
      <User user={userData}>
        <User.Avatar />
        <User.Info>
          <User.Username />
          <User.LastSeen />
        </User.Info>
      </User>
      <User user={userData}>
        <User.Avatar />
        <User.Info>
          <User.Username />
          <User.LastSeen />
        </User.Info>
        <User.Meta>
          <User.CreatedAt />
          <User.Badge />
        </User.Meta>
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
