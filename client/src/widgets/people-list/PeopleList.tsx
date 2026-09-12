'use client';

import type { UserType } from '@/entities/user/model/types';
import { User } from '@/entities/user/ui';

export function PeopleList() {
  const userData: UserType = {
    id: '1',
    username: 'John Doe',
    status: 'offline' as const,
    lastSeen: ' - Last seen, 2.02pm',
    createdAt: 'Today, 9.52pm',
  };

  return (
    <div className="flex flex-col gap-6 py-2 pr-5 pl-3 md:py-3 md:pr-6 md:pl-4 lg:py-6 lg:pr-8 lg:pl-5 bg-white shadow-input-glow rounded-3xl">
      <h2 className="text-md md:text-lg lg:text-xl font-semibold">People</h2>
      <User user={userData} variant="chatList">
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
    </div>
  );
}
