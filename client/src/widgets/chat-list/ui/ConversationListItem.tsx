import { User, type UserSummary } from '@/entities/user';
import type { ConversationDto } from '@/shared/api';
import { cn } from '@/shared/lib/class-merge';

interface ConversationListItemProps {
  conversation: ConversationDto;
  isActive: boolean;
  onSelect: (conversationId: string) => void;
}

export function ConversationListItem({
  conversation,
  isActive,
  onSelect,
}: ConversationListItemProps) {
  const user: UserSummary = {
    id: conversation.participant.id,
    username: conversation.participant.username,
    lastMessage: conversation.lastMessage?.content,
    timestamp: conversation.lastMessage?.createdAt ?? conversation.updatedAt,
  };

  return (
    <button
      type="button"
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'w-full p-2 rounded-2xl cursor-pointer transition-colors text-left',
        'focus-visible:outline-2 focus-visible:outline-chat-purple',
        isActive ? 'bg-chat-background' : 'hover:bg-chat-background/60',
      )}
    >
      <User user={user} variant="compact">
        <User.Avatar />
        <User.Info className="min-w-0 flex-1">
          <User.Username />
          <User.LastMessage />
        </User.Info>
        <User.Meta>
          <User.Timestamp />
        </User.Meta>
      </User>
    </button>
  );
}
