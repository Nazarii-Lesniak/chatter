import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

export function LastMessage({ className, ...props }: ComponentProps<'p'>) {
  const { user } = useUserContext();

  return (
    <p
      className={cn(
        'text-xs text-chat-text-muted truncate font-light tracking-wide',
        className,
      )}
      {...props}
    >
      {user.lastMessage ?? 'No messages yet'}
    </p>
  );
}
