import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { type MessageVariant, tailVariants } from './message-variants';

interface TailProps extends ComponentProps<'span'> {
  variant: MessageVariant;
}

export function Tail({ variant, className, ...props }: TailProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(tailVariants({ variant }), className)}
      {...props}
    />
  );
}
