import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

export function Username({
  children,
  className,
  ...props
}: ComponentProps<'span'>) {
  const { user } = useUserContext();

  return (
    <span
      className={cn(
        'text-3xl text-chat-text-main font-semibold tracking-wide',
        className,
      )}
      {...props}
    >
      {children || user.username}
    </span>
  );
}
