import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';

interface MessageContent extends ComponentProps<'div'> {
  children: ReactNode;
}

export function MessageContent({
  className,
  children,
  ...props
}: MessageContent) {
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
