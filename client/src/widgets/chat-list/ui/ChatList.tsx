'use client';

import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useConversationStore } from '@/entities/conversation';
import { SearchInput } from '@/features/search-by-name';
import { ConversationListItem } from '@/features/select-conversation';
import { cn } from '@/shared/lib/class-merge';
import { Button } from '@/shared/ui/button/Button';

interface ChatListProps {
  onOpenSidebar: () => void;
}

function getConversationErrorMessage(error: string) {
  if (error === 'Invalid or expired token') {
    return 'The session has expired. Please login again.';
  }

  return 'Something went wrong, please try again later';
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
  const createConversation = useConversationStore(
    (state) => state.createConversation,
  );

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

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
          onSelectUser={(user) => {
            void createConversation(user.id);
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-4 py-2 pl-3 pr-5 shadow-input-glow custom-scrollbar md:py-3 md:pl-4 md:pr-6">
        <h2 className="text-base font-semibold md:text-lg">People</h2>

        {isLoading && (
          <p className="py-4 text-center text-sm text-chat-text-muted">
            Loading conversations...
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center">
            <p className="py-4 text-center text-sm text-chat-text-muted">
              {getConversationErrorMessage(error)}
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
          <p className="py-4 text-center text-sm text-chat-text-muted">
            No conversations yet
          </p>
        )}

        {!isLoading &&
          !error &&
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
            />
          ))}
      </div>
    </div>
  );
}
