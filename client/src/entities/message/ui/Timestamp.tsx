import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

export function Timestamp({
  children,
  className,
  ...props
}: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'text-xs md:text-xs lg:text-sm text-chat-text-muted font-light tracking-wide ml-4',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
