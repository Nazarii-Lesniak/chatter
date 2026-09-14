import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const usernameVariants = cva(
  'text-chat-text-main font-semibold tracking-wide',
  {
    variants: {
      variant: {
        chatWindow: ['text-xl md:text-2xl lg:text-3xl'],
        chatList: ['text-md md:text-lg lg:text-xl'],
      },
    },
  },
);

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
