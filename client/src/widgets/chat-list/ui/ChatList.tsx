'use client';

import { useEffect } from 'react';
import { useConversationStore } from '@/entities/conversation/conversation.store';
import type { UserType } from '@/entities/user/model/types';
import { User } from '@/entities/user/ui';
import { SearchInput } from '@/features/search-by-name';

export function ChatList() {
  const conversations = useConversationStore((state) => state.conversations);
  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId,
  );
  const isLoading = useConversationStore((state) => state.isLoading);
  const error = useConversationStore((state) => state.error);
  const fetchConversations = useConversationStore(
    (state) => state.fetchConversations,
  );
  const selectConversation = useConversationStore(
    (state) => state.selectConversation,
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="hidden md:hidden lg:flex lg:flex-col lg:w-80 xl:w-96 lg:gap-5 lg:shrink-0">
      <SearchInput />

      <div className="py-2 pr-5 pl-3 md:py-3 md:pr-6 md:pl-4 lg:flex lg:flex-col lg:gap-4 lg:p-4 lg:rounded-3xl bg-white shadow-input-glow">
        <h2 className="text-base md:text-lg lg:text-lg lg:font-semibold">
          People
        </h2>

        {isLoading && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            Loading conversations...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {!isLoading && !error && conversations.length === 0 && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            No conversations yet
          </p>
        )}

        {!isLoading &&
          !error &&
          conversations.map((conversation) => {
            const user: UserType = {
              id: conversation.participant.id,
              username: conversation.participant.username,
              createdAt: conversation.participant.createdAt,
              status: 'offline',
            };

            const isActive = conversation.id === activeConversationId;

            return (
              <button
                type="button"
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`p-2 rounded-2xl cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-chat-background'
                    : 'hover:bg-chat-background/60'
                }`}
              >
                <User user={user} variant="chatList">
                  <User.Avatar />
                  <User.Info>
                    <User.Username />
                    <User.LastSeen />
                  </User.Info>
                  <User.Meta>
                    <User.CreatedAt />
                    {user.unreadCount && user.unreadCount > 0 ? (
                      <div className="ml-auto flex items-center justify-center size-5 rounded-full bg-orange-500 text-chat-text-white text-[10px] ">
                        99
                      </div>
                    ) : (
                      <User.Badge />
                    )}
                  </User.Meta>
                </User>
              </button>
            );
          })}
      </div>
    </div>
  );
}
