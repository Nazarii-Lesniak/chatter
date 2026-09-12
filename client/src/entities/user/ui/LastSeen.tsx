import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const lastSeenVariants = cva('text-chat-text-main font-light tracking-wide', {
  variants: {
    variant: {
      chatWindow: ['text-md md:text-lg lg:text-xl'],
      chatList: ['text-sm md:text-md lg:text-lg'],
    },
  },
});

export function LastSeen({
  children,
  className,
  ...props
}: ComponentProps<'time'>) {
  const { user, variant } = useUserContext();

  const isOnline = user.status === 'online';

  return (
    <time className={cn(lastSeenVariants({ variant }), className)} {...props}>
      {!isOnline ? `${user.status}${user.lastSeen}` : `${user.status}`}
    </time>
  );
}
