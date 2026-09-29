'use client';

import { useEffect } from 'react';
import { useConversationStore } from '@/entities/conversation/conversation.store';
import { Message } from '@/entities/message';
import { useMessageStore } from '@/entities/message/model/message.store';
import { User } from '@/entities/user';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { UserType } from '@/entities/user/model/types';
import { ChatActions } from '@/features/chat-actions/ui/ChatActions';
import { MessageInput } from '@/features/send-message';

export function ChatWindow() {
  const currentUser = useAuthStore((state) => state.user);

  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId,
  );
  const conversations = useConversationStore((state) => state.conversations);

  const messages = useMessageStore((state) => state.messages);
  const isLoading = useMessageStore((state) => state.isLoading);
  const error = useMessageStore((state) => state.error);
  const fetchMessages = useMessageStore((state) => state.fetchMessages);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    fetchMessages(activeConversationId);
  }, [activeConversationId, fetchMessages]);

  if (!activeConversation) {
    return (
      <div className="flex flex-col w-full h-full p-3 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl bg-white items-center justify-center shadow-input-glow">
        <p className="text-sm text-chat-text-muted">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  const companion: UserType = {
    id: activeConversation.participant.id,
    username: activeConversation.participant.username,
    createdAt: activeConversation.participant.createdAt,
    status: 'offline',
  };

  return (
    <div className="flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow">
      <div className="flex justify-between w-full pb-2 md:pb-3 lg:pb-4">
        <User user={companion} variant="chatWindow">
          <User.Avatar />
          <User.Info>
            <User.Username />
            <User.LastSeen />
          </User.Info>
        </User>

        <ChatActions />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-3 my-2 p-3 scrollbar-thin">
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
      </div>

      <MessageInput />
    </div>
  );
}
