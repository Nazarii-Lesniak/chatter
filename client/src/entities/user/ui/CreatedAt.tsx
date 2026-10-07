import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const CreatedAtVariants = cva('text-chat-text-main font-light tracking-wide', {
  variants: {
    variant: {
      chatWindow: ['text-xs md:text-xs lg:text-sm'],
      chatList: ['text-[11px] md:text-xs shrink-0'],
    },
  },
});

function formatTimestamp(dateString?: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const daysDiff = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysDiff === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  if (daysDiff === 1) {
    return 'Yesterday';
  }

  if (daysDiff < 7 && daysDiff > 0) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
