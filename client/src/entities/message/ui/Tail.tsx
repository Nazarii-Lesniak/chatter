import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { type messageVariants, tailVariants } from './message-variants';

interface ITail extends VariantProps<typeof messageVariants> {
  variant: 'companion' | 'own';
}

export function Tail({ variant, className }: ITail & ComponentProps<'span'>) {
  return <span className={cn(tailVariants({ variant }), className)}></span>;
}
