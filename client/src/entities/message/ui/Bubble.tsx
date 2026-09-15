import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { messageVariants } from './message-variants';
import { Tail } from './Tail';

type TMessageVariant = 'companion' | 'own';

interface IBubble extends ComponentProps<'div'> {
  variant: TMessageVariant;
  children: ReactNode;
}

export function Bubble({ variant, children, className, ...props }: IBubble) {
  return (
    <div className="relative flex items-end gap-3">
      <Tail variant={variant} />
      <div className={cn(messageVariants({ variant }), className)} {...props}>
        {children}
      </div>
    </div>
  );
}
