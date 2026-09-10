import Image from 'next/image';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

interface IAvatar extends ComponentProps<'div'> {
  children?: ReactNode;
}

export function Avatar({ children, className, ...props }: IAvatar) {
  const { user } = useUserContext();

  return (
    <div
      className={cn(
        'flex self-center items-center justify-center text-3xl w-19 h-19 rounded-full bg-chat-icon-action/60',
        className,
      )}
      {...props}
    >
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.username}
          className="w-full h-full rounded-full object-cover text-base"
        />
      ) : (
        children || user.username.charAt(0).toUpperCase()
      )}
    </div>
  );
}
