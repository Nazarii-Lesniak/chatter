import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

interface IUsername extends ComponentProps<'span'> {
  children?: ReactNode;
}

export function Username({ children, className, ...props }: IUsername) {
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
