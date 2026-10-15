import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const statusVariants = cva('text-chat-text-main font-light tracking-wide', {
  variants: {
    variant: {
      default: 'text-xs lg:text-sm',
      compact: 'text-xs',
    },
  },
});

export function Status({ className, ...props }: ComponentProps<'span'>) {
  const { user, variant } = useUserContext();

  if (!user.status) {
    return null;
  }

  return (
    <span className={cn(statusVariants({ variant }), className)} {...props}>
      {user.status}
    </span>
  );
}
