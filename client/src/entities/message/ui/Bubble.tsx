import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useMessageContext } from './MessageContext';
import { messageVariants } from './message-variants';
import { Tail } from './Tail';

interface IBubble extends ComponentProps<'div'> {
  children: ReactNode;
}

export function Bubble({ children, className, ...props }: IBubble) {
  const { variant } = useMessageContext();

  return (
    <div className="relative flex items-end gap-3">
      <Tail />
      <div className={cn(messageVariants({ variant }), className)} {...props}>
        {children}
      </div>
    </div>
  );
}
