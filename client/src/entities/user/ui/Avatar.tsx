import Image from 'next/image';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useUserContext } from './UserContext';

export function Avatar({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
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
