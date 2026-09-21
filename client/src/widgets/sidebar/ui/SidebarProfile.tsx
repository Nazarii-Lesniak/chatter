'use client';

import { useAuthStore } from '@/entities/user';

export function SidebarProfile() {
  const username = useAuthStore((state) => state.username);

  const initial = username ? username.charAt(0).toUpperCase() : 'N/A';

  return (
    <div
      title={username ?? 'Profile'}
      className="size-10 rounded-full bg-white/20 flex items-center justify-center text-chat-text-white font-semibold text-sm shrink-0 cursor-default"
    >
      {initial}
    </div>
  );
}
