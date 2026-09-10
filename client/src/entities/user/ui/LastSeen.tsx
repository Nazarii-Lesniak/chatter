import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

interface ILastSeen extends ComponentProps<'span'> {
  children?: ReactNode;
}

export function LastSeen({ children, className, ...props }: ILastSeen) {
  const { user } = useUserContext();

  const isUser = user.status === 'online';

  return (
    <span
      className={cn(
        'text-xl text-chat-text-main font-light tracking-wide',
        className,
      )}
      {...props}
    >
      {!isUser ? `${user.status}${user.lastSeen}` : `${user.status}`}
    </span>
  );
}
