import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { formatTimestamp } from '@/shared/lib/format/format-timestamp';
import { useUserContext } from './UserContext';

const CreatedAtVariants = cva('text-chat-text-main font-light tracking-wide', {
  variants: {
    variant: {
      chatWindow: ['text-xs md:text-xs lg:text-sm'],
      chatList: ['text-[11px] md:text-xs shrink-0'],
    },
  },
});

export function CreatedAt({ className, ...props }: ComponentProps<'time'>) {
  const { user, variant } = useUserContext();

  return (
    <time
      dateTime={user.createdAt}
      className={cn(CreatedAtVariants({ variant }), className)}
      {...props}
    >
      {formatTimestamp(user.createdAt)}
    </time>
  );
}
