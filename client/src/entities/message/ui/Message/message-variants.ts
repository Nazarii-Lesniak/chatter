import { cva } from 'class-variance-authority';

export const messageVariants = cva('text-2xl px-10 py-3 rounded-3xl', {
  variants: {
    variant: {
      companion: 'bg-chat-message-bubble-companion text-chat-text-main',
      own: 'bg-chat-message-bubble-own text-chat-text-white',
    },
  },
  defaultVariants: {
    variant: 'companion',
  },
});

export const tailVariants = cva('absolute w-4 h-4 rounded-full', {
  variants: {
    variant: {
      companion: '-left-2.5 -bottom-2.5 bg-chat-message-bubble-companion',
      own: '-right-2.5 -bottom-2.5 bg-chat-message-bubble-own',
    },
  },
  defaultVariants: {
    variant: 'companion',
  },
});
