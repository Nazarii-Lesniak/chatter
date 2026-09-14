'use client';

import type { UserType } from '@/entities/user/model/types';
import { User } from '@/entities/user/ui';
import { SearchInput } from '@/features/search-by-name';

const userData: UserType = {
  id: '1',
  username: 'John Doe',
  status: 'offline' as const,
  lastSeen: ' - Last seen, 2.02pm',
  createdAt: 'Today, 9.52pm',
};

export function ChatList() {
  return (
    <div className="hidden md:hidden lg:flex lg:flex-col lg:w-80 xl:w-96 lg:gap-5 lg:shrink-0">
      <SearchInput />
      <div className="py-2 pr-5 pl-3 md:py-3 md:pr-6 md:pl-4 lg:flex lg:flex-col lg:gap-4 lg:p-4 lg:rounded-3xl   bg-white shadow-input-glow ">
        <h2 className="text-base md:text-lg lg:text-lg lg:font-semibold">
          People
        </h2>
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
    </div>
  );
}
