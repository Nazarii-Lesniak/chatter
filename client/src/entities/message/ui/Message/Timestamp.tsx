import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';

interface ITimestamp extends ComponentProps<'span'> {
  children: ReactNode;
}

export function Timestamp({ children, className, ...props }: ITimestamp) {
  return (
    <span
      className={cn(
        'text-xl text-chat-text-muted font-light tracking-wide ml-4',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
