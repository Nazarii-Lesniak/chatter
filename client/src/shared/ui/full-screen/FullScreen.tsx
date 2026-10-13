import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

export function FullScreen({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-dvh w-full items-center justify-center bg-chat-background',
        className,
      )}
      {...props}
    />
  );
}
