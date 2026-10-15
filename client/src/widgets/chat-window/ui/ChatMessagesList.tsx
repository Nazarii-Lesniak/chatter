import { Message } from '@/entities/message';
import type { MessageDto } from '@/shared/api';
import { cn } from '@/shared/lib/class-merge';
import { formatClockTime } from '@/shared/lib/format';
import { useScrollActivity, useStickToBottom } from '@/shared/lib/hooks';

interface ChatMessagesListProps {
  conversationId: string;
  currentUserId: string | undefined;
  messages: MessageDto[];
  isLoading: boolean;
  error: string | null;
}

export function ChatMessagesList({
  conversationId,
  currentUserId,
  messages,
  isLoading,
  error,
}: ChatMessagesListProps) {
  const { containerRef, onScroll: syncPinnedState } =
    useStickToBottom<HTMLDivElement>({
      itemCount: messages.length,
      resetKey: conversationId,
      isReady: !isLoading,
      forceOnNewItem: messages.at(-1)?.senderId === currentUserId,
    });
  const { isScrolling, onScroll: markScrolling } = useScrollActivity();

  const handleScroll = () => {
    syncPinnedState();
    markScrolling();
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      role="log"
      aria-label="Messages"
      aria-busy={isLoading}
      className={cn(
        'flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-3 my-2 p-3 custom-scrollbar',
        isScrolling && 'is-scrolling',
      )}
    >
      {isLoading && (
        <p className="text-sm text-chat-text-muted text-center py-4">
          Loading messages...
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-chat-error text-center py-4">
          {error}
        </p>
      )}

      {!isLoading && !error && messages.length === 0 && (
        <p className="text-sm text-chat-text-muted text-center py-4">
          No messages yet
        </p>
      )}

      {messages.map((message) => {
        const isOwn = message.senderId === currentUserId;

        return (
          <Message
            key={message.id}
            className={isOwn ? 'self-end items-end' : 'self-start'}
          >
            <Message.Bubble variant={isOwn ? 'own' : 'companion'}>
              {message.content}
            </Message.Bubble>

            <Message.Timestamp>
              {formatClockTime(message.createdAt)}
            </Message.Timestamp>
          </Message>
        );
      })}
    </div>
  );
}
