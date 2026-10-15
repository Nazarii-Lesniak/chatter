import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

const spinnerVariants = cva(
  'animate-spin rounded-full border-chat-sidebar/20 border-t-chat-sidebar',
  {
    variants: {
      size: {
        md: 'size-8 border-3',
        lg: 'size-10 border-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

interface SpinnerProps
  extends ComponentProps<'div'>,
    VariantProps<typeof spinnerVariants> {}

export function Spinner({ size, className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}
