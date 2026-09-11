'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import type { UserType } from '../model/types';
import { UserContext } from './UserContext';

export function UserContent({
  className,
  user,
  children,
  ...props
}: { user: UserType } & ComponentProps<'div'>) {
  return (
    <UserContext value={{ user }}>
      <div className={cn('flex gap-4 items-center', className)} {...props}>
        {children}
      </div>
    </UserContext>
  );
}
