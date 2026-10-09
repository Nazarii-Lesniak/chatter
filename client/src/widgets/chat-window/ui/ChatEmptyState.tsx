import { cn } from '@/shared/lib/class-merge';

interface ChatEmptyStateProps {
  isMobileView: boolean;
}

export function ChatEmptyState({ isMobileView }: ChatEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col w-full h-full p-3 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl bg-white items-center justify-center shadow-input-glow',
        isMobileView
          ? 'hidden md:flex'
          : 'flex animate-slide-in-right md:animate-none',
      )}
    >
      <p className="text-sm text-chat-text-muted">
        Select a conversation to start chatting
      </p>
    </div>
  );
}
