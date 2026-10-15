'use client';

import { PanelLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useConversationStore,
  useIsConversationOpen,
} from '@/entities/conversation';
import { SearchInput } from '@/features/search-by-name';
import type { UserDto } from '@/shared/api';
import { cn } from '@/shared/lib/class-merge';
import { getErrorMessage } from '@/shared/lib/get-error-message';
import { Button } from '@/shared/ui/button';
import { ConversationListItem } from './ConversationListItem';

interface ChatListProps {
  onOpenSidebar: () => void;
}

export function ChatList({ onOpenSidebar }: ChatListProps) {
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
  const startConversation = useConversationStore(
    (state) => state.startConversation,
  );
  const isConversationOpen = useIsConversationOpen();

  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  const handleSelectUser = async (user: UserDto) => {
    setStartError(null);

    try {
      await startConversation(user.id);
    } catch (error) {
      setStartError(getErrorMessage(error, 'Failed to start a conversation'));
    }
  };

  const hasLoaded = !isLoading && !error;

  return (
    <div
      className={cn(
        'flex flex-col w-full gap-5 md:w-80 xl:w-96 md:shrink-0',
        isConversationOpen
          ? 'hidden md:flex'
          : 'flex animate-slide-in-left md:animate-none',
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="addon"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
          className="lg:hidden"
        >
          <PanelLeft aria-hidden="true" />
        </Button>

        <SearchInput onSelectUser={handleSelectUser} />
      </div>

      {startError && (
        <p role="alert" className="text-sm text-chat-error">
          {startError}
        </p>
      )}

      <section
        aria-labelledby="people-heading"
        className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-4 py-2 pl-3 pr-5 shadow-input-glow custom-scrollbar md:py-3 md:pl-4 md:pr-6"
      >
        <h2 id="people-heading" className="text-base font-semibold md:text-lg">
          People
        </h2>

        {isLoading && (
          <p
            role="status"
            className="py-4 text-center text-sm text-chat-text-muted"
          >
            Loading conversations...
          </p>
        )}

        {error && (
          <div role="alert" className="flex flex-col items-center">
            <p className="py-4 text-center text-sm text-chat-text-muted">
              {error}
            </p>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => void fetchConversations()}
            >
              Try again
            </Button>
          </div>
        )}

        {hasLoaded && conversations.length === 0 && (
          <p className="py-4 text-center text-sm text-chat-text-muted">
            No conversations yet
          </p>
        )}

        {hasLoaded &&
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onSelect={selectConversation}
            />
          ))}
      </section>
    </div>
  );
}
