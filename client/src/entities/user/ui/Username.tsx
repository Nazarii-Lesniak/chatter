import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const usernameVariants = cva('text-chat-text-main tracking-wide', {
  variants: {
    variant: {
      chatWindow: ['text-sm md:text-base lg:text-lg font-semibold'],
      chatList: ['text-xs md:text-sm lg:text-sm lg:font-semibold'],
    },
  },
});

export function Username({
  children,
  className,
  ...props
}: ComponentProps<'span'>) {
  const { user, variant } = useUserContext();

  return (
    <span className={cn(usernameVariants({ variant }), className)} {...props}>
      {children || user.username}
    </span>
  );
}
