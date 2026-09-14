import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'transition-colors cursor-pointer flex items-center justify-center',
  {
    variants: {
      variant: {
        sidebar: [
          'text-chat-icon-sidebar hover:text-chat-icon-sidebar/80',
          'size-7 md:size-8 lg:size-9',
          'p-1 md:p-1.5 md:p-2',
        ],
        action: [
          'text-chat-icon-action hover:text-chat-icon-action/80',
          'size-7 md:size-8 lg:size-9',
          'p-1 md:p-1.5 md:p-2',
        ],
        addon: [
          'text-chat-icon-addon hover:text-chat-icon-addon/80',
          'size-7 md:size-8 lg:size-9',
          'p-1 md:p-1.5 md:p-2',
        ],
        voice: [
          'text-chat-icon-voice hover:text-chat-icon-voice/80',
          'size-7 md:size-8 lg:size-9',
          'p-1 md:p-1.5 md:p-2',
        ],
        search: [
          'text-chat-icon-search hover:text-chat-icon-search/80',
          'size-7 md:size-8 lg:size-9',
          'p-1 md:p-1.5 md:p-2',
        ],
      },
    },
    defaultVariants: {
      variant: 'sidebar',
    },
  },
);
