'use client';

import { useActiveConversation } from '@/entities/conversation';
import { useMessageStore } from '@/entities/message';
import { useAuthStore, useUserStatus } from '@/entities/user';
import { MessageInput } from '@/features/send-message';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatWindowHeader } from './ChatWindowHeader';

interface ChatWindowProps {
  isConnected: boolean;
  onSendMessage: (content: string) => boolean;
}

export function ChatWindow({ isConnected, onSendMessage }: ChatWindowProps) {
  const conversation = useActiveConversation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const messages = useMessageStore((state) => state.messages);
  const isLoading = useMessageStore((state) => state.isLoading);
  const error = useMessageStore((state) => state.error);
  const sendError = useMessageStore((state) => state.sendError);
  const companionStatus = useUserStatus(conversation?.participant.id);

  if (!conversation) {
    return <ChatEmptyState />;
  }

  return (
    <section
      aria-label={`Conversation with ${conversation.participant.username}`}
      className="flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow animate-slide-in-right md:animate-none"
    >
      <ChatWindowHeader
        companion={{
          id: conversation.participant.id,
          username: conversation.participant.username,
          status: companionStatus,
        }}
      />

      <ChatMessagesList
        conversationId={conversation.id}
        currentUserId={currentUserId}
        messages={messages}
        isLoading={isLoading}
        error={error}
      />

      {sendError && (
        <p role="alert" className="text-sm text-chat-error px-1">
          {sendError}
        </p>
      )}

      <MessageInput
        key={conversation.id}
        onSend={onSendMessage}
        disabled={!isConnected}
      />
    </section>
  );
}
