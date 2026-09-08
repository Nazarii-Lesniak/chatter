import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { inputVariants } from './input.variants';

export interface IRoot extends ComponentProps<'div'> {
  variant: 'search' | 'message';
  children?: React.ReactNode;
}

export function Root({ className, variant, children, ...props }: IRoot) {
  return (
    <div
      className={cn(
        'flex items-center',
        variant === 'search' ? 'max-w-120' : 'max-w-200',
        inputVariants({ variant, className }),
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface IIconProps extends ComponentProps<'div'> {}

export function Icon({ className, children, ...props }: IIconProps) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface IFieldProps extends ComponentProps<'input'> {}

export function Field({ className, ...props }: IFieldProps) {
  return (
    <input
      className={cn(`w-full h-full bg-transparent outline-hidden`, className)}
      {...props}
    />
  );
}

interface ITextareaProps extends ComponentProps<'textarea'> {}

export function Textarea({ className, ...props }: ITextareaProps) {
  return (
    <textarea
      className={cn(
        `w-full h-full content-center bg-transparent outline-hidden p-0 m-0 border-0 resize-none`,
        className,
      )}
      {...props}
    />
  );
}

export const Input = Object.assign(Root, {
  Icon,
  Field,
  Textarea,
});
