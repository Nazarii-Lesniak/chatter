import { cva } from 'class-variance-authority';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const avatarVariants = cva(
  'flex self-center items-center justify-center rounded-full bg-chat-icon-action/60 shrink-0',
  {
    variants: {
      variant: {
        chatWindow: [
          'w-13 md:w-15 lg:w-19',
          'h-13 md:h-15 lg:h-19',
          'text-xl md:text-2xl lg:text-3xl',
        ],
        chatList: [
          'w-9 md:w-11 lg:w-13',
          'h-9 md:h-11 lg:h-13',
          'text-md md:text-lg lg:text-xl',
        ],
      },
    },
  },
);

export function Avatar({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  const { user, variant } = useUserContext();

  return (
    <div className={cn(avatarVariants({ variant }), className)} {...props}>
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.username}
          fill
          sizes="76px"
          className="object-cover"
        />
      ) : (
        children || user.username.charAt(0).toUpperCase()
      )}
    </div>
  );
}
