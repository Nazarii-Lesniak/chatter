import { cva } from 'class-variance-authority';

const ICON_SIZE =
  'size-7 p-1 md:size-8 md:p-1.5 lg:size-9 lg:p-2 shrink-0 [&>svg]:size-full';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center transition-colors cursor-pointer',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
  ],
  {
    variants: {
      variant: {
        sidebar: [
          ICON_SIZE,
          'text-chat-icon-sidebar hover:text-chat-icon-sidebar/80 focus-visible:outline-white',
        ],
        action: [
          ICON_SIZE,
          'text-chat-icon-action hover:text-chat-icon-action/80 focus-visible:outline-chat-icon-action',
        ],
        addon: [
          ICON_SIZE,
          'text-chat-icon-addon hover:text-chat-icon-addon/80 focus-visible:outline-chat-icon-action',
        ],
        primary: [
          'h-11 md:h-12 rounded-3xl',
          'bg-chat-purple text-white hover:opacity-80 transition-opacity',
          'text-xs md:text-sm font-semibold tracking-wide',
          'focus-visible:outline-chat-purple',
        ],
      },
    },
  },
);
