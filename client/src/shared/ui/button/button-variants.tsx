import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'transition-colors cursor-pointer flex items-center justify-center',
  {
    variants: {
      variant: {
        sidebar: [
          'text-chat-icon-sidebar hover:text-chat-icon-sidebar/80',
          'size-6 md:size-8 lg:size-10',
        ],
        action: [
          'text-chat-icon-action hover:text-chat-icon-action/80',
          'size-6 md:size-8 lg:size-10',
        ],
        addon: [
          'text-chat-icon-addon hover:text-chat-icon-addon/80',
          'size-6 md:size-8 lg:size-10',
        ],
        voice: [
          'text-chat-icon-voice hover:text-chat-icon-voice/80',
          'size-6 md:size-8 lg:size-10',
        ],
        search: [
          'text-chat-icon-search hover:text-chat-icon-search/80',
          'size-6 md:size-8 lg:size-10',
        ],
      },
    },
    defaultVariants: {
      variant: 'sidebar',
    },
  },
);
