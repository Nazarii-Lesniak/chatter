'use client';

import type { ComponentProps } from 'react';
import type { UserContextProps } from '@/entities/user';
import { cn } from '@/shared/lib/class-merge';
import { UserContext } from './UserContext';

export function UserContent({
  className,
  user,
  variant,
  children,
  ...props
}: UserContextProps & ComponentProps<'div'>) {
  return (
    <UserContext value={{ user, variant }}>
      <div className={cn('flex gap-4 items-center', className)} {...props}>
        {children}
      </div>
    </UserContext>
  );
}
