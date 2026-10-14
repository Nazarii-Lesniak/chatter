import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

export function MessageContent({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 items-start wrap-break-word',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
