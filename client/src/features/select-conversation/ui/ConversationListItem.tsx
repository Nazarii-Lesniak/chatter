'use client';

import { useConversationStore } from '@/entities/conversation';
import { User } from '@/entities/user';
import type { UserType } from '@/entities/user/model/types';
import type { Conversation } from '@/shared/api/types/conversation.types';
import { cn } from '@/shared/lib/class-merge';

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationListItem({
  conversation,
  isActive,
}: ConversationListItemProps) {
  const selectConversation = useConversationStore(
    (state) => state.selectConversation,
  );

  const lastActivityTime =
    conversation.lastMessage?.createdAt ??
    conversation.updatedAt ??
    conversation.createdAt;

  const user: UserType = {
    id: conversation.participant.id,
    username: conversation.participant.username,
    createdAt: lastActivityTime,
    status: 'offline',
    lastMessage: conversation.lastMessage?.content,
  };

  return (
    <button
      type="button"
      aria-pressed={isActive}
      key={conversation.id}
      onClick={() => selectConversation(conversation.id)}
      className={cn(
        'w-full p-2 rounded-2xl cursor-pointer transition-colors text-left',
        isActive ? 'bg-chat-background' : 'hover:bg-chat-background/60',
      )}
    >
      <User user={user} variant="chatList">
        <User.Avatar />
        <User.Info className="min-w-0 flex-1">
          <User.Username />
          <User.LastMessage />
        </User.Info>
        <User.Meta>
          <User.CreatedAt /> <User.Badge />
        </User.Meta>
      </User>
    </button>
  );
}
