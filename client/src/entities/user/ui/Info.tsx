import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

export function Info({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col justify-center', className)} {...props}>
      {children}
    </div>
  );
}
