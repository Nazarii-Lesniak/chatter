import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { type MessageVariant, messageVariants } from './message-variants';
import { Tail } from './Tail';

interface BubbleProps extends ComponentProps<'div'> {
  variant: MessageVariant;
  children: ReactNode;
}

export function Bubble({
  variant,
  children,
  className,
  ...props
}: BubbleProps) {
  return (
    <div className="relative flex items-end gap-3">
      <Tail variant={variant} />
      <div className={cn(messageVariants({ variant }), className)} {...props}>
        {children}
      </div>
    </div>
  );
}
