import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/class-merge';

const avatarVariants = cva(
  'flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-chat-icon-action/60 font-semibold text-chat-text-white',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        compact: 'size-8 md:size-9 lg:size-11 text-xs lg:text-sm',
        default:
          'size-10 md:size-11 lg:size-13 text-sm md:text-base lg:text-lg',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

interface UserAvatarProps
  extends ComponentProps<'div'>,
    VariantProps<typeof avatarVariants> {
  username: string;
}

function getInitial(username: string) {
  return Array.from(username.trim())[0]?.toUpperCase() ?? '?';
}

export function UserAvatar({
  username,
  size,
  className,
  ...props
}: UserAvatarProps) {
  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {getInitial(username)}
    </div>
  );
}
