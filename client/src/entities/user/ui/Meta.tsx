import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

export function Meta({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col ml-auto gap-1', className)} {...props}>
      {children}
    </div>
  );
}
