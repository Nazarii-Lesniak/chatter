import { cva } from 'class-variance-authority';

export const messageVariants = cva(
  'text-xs md:text-sm lg:text-sm px-3.5 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-2.5 rounded-3xl max-w-[80dvw] md:max-w-[60dvw] lg:max-w-[40dvw]',
  {
    variants: {
      variant: {
        companion: 'bg-chat-message-bubble-companion text-chat-text-main',
        own: 'bg-chat-message-bubble-own text-chat-text-white',
      },
    },
    defaultVariants: {
      variant: 'companion',
    },
  },
);

export const tailVariants = cva(
  'absolute size-2 -bottom-1 md:size-2.5 md:-bottom-1 lg:size-2.5 lg:-bottom-1 rounded-full',
  {
    variants: {
      variant: {
        companion: '-left-2.5 -bottom-2.5 bg-chat-message-bubble-companion',
        own: '-right-2.5 -bottom-2.5 bg-chat-message-bubble-own',
      },
    },
    defaultVariants: {
      variant: 'companion',
    },
  },
);
