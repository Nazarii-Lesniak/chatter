import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { formatTimestamp } from '@/shared/lib/format';
import { useUserContext } from './UserContext';

const timestampVariants = cva('text-chat-text-main font-light tracking-wide', {
  variants: {
    variant: {
      default: 'text-xs lg:text-sm',
      compact: 'text-[11px] md:text-xs shrink-0',
    },
  },
});

export function Timestamp({ className, ...props }: ComponentProps<'time'>) {
  const { user, variant } = useUserContext();

  if (!user.timestamp) {
    return null;
  }

  return (
    <time
      dateTime={user.timestamp}
      className={cn(timestampVariants({ variant }), className)}
      {...props}
    >
      {formatTimestamp(user.timestamp)}
    </time>
  );
}
