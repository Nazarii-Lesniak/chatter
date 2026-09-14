import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const CreatedAtVariants = cva('text-chat-text-main font-light tracking-wide', {
  variants: {
    variant: {
      chatWindow: ['text-md md:text-lg lg:text-xl'],
      chatList: ['text-sm md:text-md lg:text-lg'],
    },
  },
});

export function CreatedAt({ className, ...props }: ComponentProps<'time'>) {
  const { user, variant } = useUserContext();

  return (
    <time className={cn(CreatedAtVariants({ variant }), className)} {...props}>
      {user.createdAt}
    </time>
  );
}
