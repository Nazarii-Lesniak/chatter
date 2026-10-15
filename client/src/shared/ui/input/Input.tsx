import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { inputVariants } from './input-variants';

type InputVariantProps = VariantProps<typeof inputVariants>;

interface InputRootProps extends ComponentProps<'div'> {
  variant: NonNullable<InputVariantProps['variant']>;
}

function Root({ className, variant, ...props }: InputRootProps) {
  return (
    <div className={cn(inputVariants({ variant }), className)} {...props} />
  );
}

function Icon({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    />
  );
}

function Field({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn('w-full h-full bg-transparent outline-hidden', className)}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={1}
      className={cn(
        'w-full h-full content-center bg-transparent outline-hidden p-0 m-0 border-0 resize-none',
        className,
      )}
      {...props}
    />
  );
}

export const Input = Object.assign(Root, { Icon, Field, Textarea });
