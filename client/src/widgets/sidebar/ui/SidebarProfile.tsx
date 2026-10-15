'use client';

import { UserAvatar, useAuthStore } from '@/entities/user';

export function SidebarProfile() {
  const username = useAuthStore((state) => state.user?.username);

  if (!username) {
    return null;
  }

  return (
    <UserAvatar
      username={username}
      role="img"
      aria-label={`Signed in as ${username}`}
      title={username}
      className="bg-white/20 cursor-default"
    />
  );
}
