'use client';

import { useChatStore } from '@/entities/chat';
import { User } from '@/entities/user/ui';
import { SearchInput } from '@/features/search-by-name';

export function ChatList() {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);

  const setActiveChat = useChatStore((state) => state.setActiveChat);

  return (
    <div className="hidden md:hidden lg:flex lg:flex-col lg:w-80 xl:w-96 lg:gap-5 lg:shrink-0">
      <SearchInput />

      <div className="py-2 pr-5 pl-3 md:py-3 md:pr-6 md:pl-4 lg:flex lg:flex-col lg:gap-4 lg:p-4 lg:rounded-3xl bg-white shadow-input-glow">
        <h2 className="text-base md:text-lg lg:text-lg lg:font-semibold">
          People
        </h2>

        {chats.length === 0 && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            Search for a user to start chatting
          </p>
        )}

        {chats.map((chat) => (
          <button
            type="button"
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`p-2 rounded-2xl cursor-pointer transition-colors ${
              chat.id === activeChatId
                ? 'bg-chat-background'
                : 'hover:bg-chat-background/60'
            }`}
          >
            <User user={chat} variant="chatList">
              <User.Avatar />
              <User.Info>
                <User.Username />
                <User.LastSeen />
              </User.Info>
              <User.Meta>
                <User.CreatedAt />
                {chat.unreadCount > 0 ? (
                  <div className="ml-auto flex items-center justify-center size-5 rounded-full bg-orange-500 text-chat-text-white text-[10px] ">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </div>
                ) : (
                  <User.Badge />
                )}
              </User.Meta>
            </User>
          </button>
        ))}
      </div>
    </div>
  );
}
