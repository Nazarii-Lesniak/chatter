import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { UserAvatar } from './UserAvatar';
import { useUserContext } from './UserContext';

export function Avatar({
  className,
  ...props
}: Omit<ComponentProps<typeof UserAvatar>, 'username' | 'size'>) {
  const { user, variant } = useUserContext();

  return (
    <UserAvatar
      username={user.username}
      size={variant}
      aria-hidden="true"
      className={cn('self-center', className)}
      {...props}
    />
  );
}
