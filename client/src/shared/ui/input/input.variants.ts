import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'w-full rounded-3xl shadow-input-glow outline-hidden focus-within:shadow-input-glow-focus  transition-shadow',
  {
    variants: {
      variant: {
        search: [
          'hidden md:hidden lg:flex lg:w-full',
          'h-8 md:h-10 lg:h-12',
          'px-2 md:px-3 lg:px-4',
          'gap-2 md:gap-2 lg:gap-3',
          'text-sm md:text-sm lg:text-sm',
          'tracking-wider',
          'text-chat-text-muted placeholder:text-chat-text-muted',
          'bg-white',
        ],
        message: [
          'w-full',
          'h-11 md:h-12 lg:h-14',
          'px-3 md:px-4 lg:px-5',
          'gap-2 md:gap-3 lg:gap-4',
          'text-sm md:text-sm lg:text-base',
          'font-light',
          'text-chat-text-main placeholder:text-chat-text-main',
          'bg-chat-background',
        ],
      },
    },
    defaultVariants: {
      variant: 'search',
    },
  },
);
