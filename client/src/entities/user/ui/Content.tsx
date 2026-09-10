'use client';

import type React from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { type IUser, UserContext } from './UserContext';

interface IUserContent extends ComponentProps<'div'> {
  user: IUser;
  children: React.ReactNode;
}

export function UserContent({
  className,
  user,
  children,
  ...props
}: IUserContent) {
  return (
    <UserContext value={{ user }}>
      <div className={cn('flex gap-4 items-center', className)} {...props}>
        {children}
      </div>
    </UserContext>
  );
}
