import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

export function LastMessage({
  children,
  className,
  ...props
}: ComponentProps<'p'>) {
  const { user } = useUserContext();

  return (
    <p
      className={cn(
        'text-xs text-chat-text-muted truncate max-w-36 md:max-w-40 font-light tracking-wide',
        className,
      )}
      {...props}
    >
      {children || user.lastMessage || 'No messages yet'}
    </p>
  );
}
