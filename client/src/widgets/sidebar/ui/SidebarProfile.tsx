'use client';

import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { Button } from '@/shared/ui/button/Button';

export function SidebarProfile() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const initial = user?.username.charAt(0).toUpperCase() ?? '';

  return (
    <div
      title={user?.username}
      className="size-10 rounded-full bg-white/20 flex items-center justify-center text-chat-text-white font-semibold text-sm shrink-0 cursor-default"
    >
      {!user && (
        <Button
          type="button"
          variant="sidebar"
          onClick={() => router.push('/login')}
          aria-label="Login"
        >
          <LogIn aria-hidden={true} />
        </Button>
      )}

      {initial}
    </div>
  );
}
