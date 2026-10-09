import { Message } from '@/entities/message';
import { useAuthStore } from '@/entities/user';
import { cn } from '@/shared/lib/class-merge';
import { useAutoScroll } from '@/shared/lib/hooks/useAutoScroll';
import { useChatRoom } from '../model/useChatRoom';

export function ChatMessagesList() {
  const currentUser = useAuthStore((state) => state.user);
  const { messages, isLoading, error } = useChatRoom();

  const { handleScroll, isScrolling, messagesEndRef } = useAutoScroll({
    messages,
    isLoading,
  });

  return (
    <div
      onScroll={handleScroll}
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
        <p className="text-sm text-red-500 text-center py-4">{error}</p>
      )}

      {!isLoading && !error && messages.length === 0 && (
        <p className="text-sm text-chat-text-muted text-center py-4">
          No messages yet
        </p>
      )}

      {!isLoading &&
        !error &&
        messages.map((message) => {
          const isOwn = message.senderId === currentUser?.id;

          return (
            <Message
              key={message.id}
              className={isOwn ? 'self-end items-end' : 'self-start'}
            >
              <Message.Bubble variant={isOwn ? 'own' : 'companion'}>
                {message.content}
              </Message.Bubble>
              <Message.Timestamp>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Message.Timestamp>
            </Message>
          );
        })}
      <div ref={messagesEndRef} />
    </div>
  );
}
