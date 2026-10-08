'use client';

import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useConversationStore } from '@/entities/conversation';
import type { UserType } from '@/entities/user/model/types';
import { User } from '@/entities/user/ui';
import { SearchInput } from '@/features/search-by-name';
import { cn } from '@/shared/lib/class-merge';
import { Button } from '@/shared/ui/button/Button';

interface ChatListProps {
  onOpenSidebar: () => void;
}

export function ChatList({ onOpenSidebar }: ChatListProps) {
  const router = useRouter();

  const conversations = useConversationStore((state) => state.conversations);
  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId,
  );
  const mobileView = useConversationStore((state) => state.mobileView);
  const isLoading = useConversationStore((state) => state.isLoading);
  const error = useConversationStore((state) => state.error);
  const fetchConversations = useConversationStore(
    (state) => state.fetchConversations,
  );
  const selectConversation = useConversationStore(
    (state) => state.selectConversation,
  );
  const createConversation = useConversationStore(
    (state) => state.createConversation,
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const getNormalizedErrorMessage = (error: string) => {
    if (error === 'Invalid or expired token') {
      return 'The session has expired. Please login again.';
    }

    return 'Something went wrong, please try again later';
  };

  return (
    <div
      className={cn(
        'flex flex-col w-full gap-5 md:w-80 xl:w-96 md:shrink-0',
        mobileView === 'chat'
          ? 'hidden md:flex'
          : 'flex animate-slide-in-left md:animate-none',
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="addon"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
          className="lg:hidden shrink-0"
        >
          <PanelLeft aria-hidden="true" />
        </Button>
        <SearchInput
          onSelectUser={(user) => void createConversation(user.id)}
        />
      </div>

      <div className="py-2 pr-5 pl-3 md:py-3 md:pr-6 md:pl-4 flex flex-col gap-4 p-4 rounded-3xl bg-white shadow-input-glow flex-1 overflow-y-auto custom-scrollbar">
        <h2 className="text-base md:text-lg font-semibold">People</h2>

        {isLoading && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            Loading conversations...
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-chat-text-muted text-center py-4">
              {getNormalizedErrorMessage(error)}
            </p>
            <Button
              type="button"
              variant="auth"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          </div>
        )}

        {!isLoading && !error && conversations.length === 0 && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            No conversations yet
          </p>
        )}

        {!isLoading &&
          !error &&
          conversations.map((conversation) => {
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
                    <User.LastMessage />
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
