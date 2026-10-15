import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { buttonVariants } from './button-variants';

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface ButtonProps extends ComponentProps<'button'> {
  variant: NonNullable<ButtonVariantProps['variant']>;
}

export function Button({
  className,
  variant,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
