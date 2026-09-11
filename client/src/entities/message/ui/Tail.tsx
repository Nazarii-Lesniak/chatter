'use client';

import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';
import { useMessageContext } from './MessageContext';
import { type messageVariants, tailVariants } from './message-variants';

interface ITail extends VariantProps<typeof messageVariants> {}

export function Tail({ className }: ITail & ComponentProps<'span'>) {
  const { variant } = useMessageContext();

  return <span className={cn(tailVariants({ variant }), className)}></span>;
}
