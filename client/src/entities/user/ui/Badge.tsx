import { CheckCheck } from 'lucide-react';
import type { ComponentProps } from 'react';

export function Badge({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className="flex ml-auto" {...props}>
      {children || <CheckCheck className="text-chat-sidebar" />}
    </div>
  );
}
