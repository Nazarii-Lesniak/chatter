'use client';

import type React from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { MessageContext } from './MessageContext';

interface IMessageContent extends ComponentProps<'div'> {
  variant: 'companion' | 'own';
  children: React.ReactNode;
}

export function MessageContent({
  className,
  variant,
  children,
  ...props
}: IMessageContent) {
  return (
    <MessageContext value={{ variant }}>
      <div
        className={cn('flex flex-col gap-4 items-start', className)}
        {...props}
      >
        {children}
      </div>
    </MessageContext>
  );
}
