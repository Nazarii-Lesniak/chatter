'use client';

import type { UserType } from '@/entities/user/model/types';
import { User } from '@/entities/user/ui';
import { ChatActions } from '@/features/chat-actions/ui/ChatActions';

export function ChatHeader() {
  const userData: UserType = {
    id: '1',
    username: 'John Doe',
    status: 'offline' as const,
    lastSeen: ' - Last seen, 2.02pm',

    createdAt: 'Today, 9.52pm',
  };

  return (
    <div className="flex justify-between w-full">
      <User user={userData} variant="chatWindow">
        <User.Avatar />
        <User.Info>
          <User.Username />
          <User.LastSeen />
        </User.Info>
      </User>
      <ChatActions />
    </div>
  );
}
