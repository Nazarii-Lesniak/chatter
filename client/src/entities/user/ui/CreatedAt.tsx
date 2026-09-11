import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

export function CreatedAt({
  className,
  children,
  ...props
}: ComponentProps<'time'>) {
  const { user } = useUserContext();

  return (
    <time
      className={cn(
        'text-xl text-chat-text-main font-light tracking-wide',
        className,
      )}
      {...props}
    >
      {user.createdAt}
    </time>
  );
}
