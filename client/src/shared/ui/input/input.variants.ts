import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'w-full rounded-3xl shadow-input-glow outline-hidden focus-within:shadow-input-glow-focus  transition-shadow',
  {
    variants: {
      variant: {
        search: [
          'w-full',
          'h-12 md:h-16 lg:h-20',
          'px-4 md:px-5 lg:px-6',
          'gap-2 md:gap-4 lg:gap-5',
          'text-lg md:text-2xl lg:text-[28px]',
          'tracking-wider',
          'text-chat-text-muted placeholder:text-chat-text-muted',
          'bg-white',
        ],
        message: [
          'w-full',
          'h-12 md:h-16 lg:h-20',
          'px-3 md:px-4 lg:px-5',
          'gap-4 md:gap-6 lg:gap-8',
          'text-base md:text-xl lg:text-2xl',
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
