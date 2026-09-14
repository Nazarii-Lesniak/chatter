import { cva } from 'class-variance-authority';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

const avatarVariants = cva(
  'flex self-center items-center justify-center rounded-full bg-chat-icon-action/60 shrink-0 relative overflow-hidden rounded-full',
  {
    variants: {
      variant: {
        chatWindow: [
          'size-10 md:size-11 lg:size-13',
          'text-sm md:text-base lg:text-lg',
        ],
        chatList: [
          'size-8 md:size-9 lg:size-11',
          'text-xs md:text-xs lg:text-sm',
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
