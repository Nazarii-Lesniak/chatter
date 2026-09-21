'use client';

import { SearchIcon, X } from 'lucide-react';
import { type ChangeEvent, useCallback, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useChatStore } from '@/entities/chat';
import { socketClient } from '@/shared/api/socket';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

const DEBOUNCE_MS = 300;

export function SearchInput() {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { searchResults, currentUserId, openChat, clearSearchResults } =
    useChatStore(
      useShallow((state) => ({
        searchResults: state.searchResults,
        currentUserId: state.currentUserId,
        openChat: state.openChat,
        clearSearchResults: state.clearSearchResults,
      })),
    );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!value.trim() || !currentUserId) {
        clearSearchResults();
        return;
      }

      debounceTimer.current = setTimeout(() => {
        socketClient.send({
          type: 'SEARCH_USERS',
          payload: { query: value.trim() },
        });
      }, DEBOUNCE_MS);
    },
    [currentUserId, clearSearchResults],
  );

  const handleClear = () => {
    setQuery('');
    clearSearchResults();
  };

  const handleSelectUser = (user: { userId: string; username: string }) => {
    openChat(user);
    setQuery('');
  };

  return (
    <div className="relative hidden md:hidden lg:flex lg:flex-col lg:w-full">
      <Input.Root variant="search">
        <Input.Icon>
          <Button variant="search">
            <SearchIcon aria-label="Search" />
          </Button>
        </Input.Icon>
        <Input.Field
          type="text"
          placeholder="Search users…"
          value={query}
          onChange={handleChange}
          aria-label="Search users by name"
        />
        {query && (
          <Input.Icon>
            <button
              type="button"
              onClick={handleClear}
              className="text-chat-text-muted hover:text-chat-text-main transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          </Input.Icon>
        )}
      </Input.Root>

      {searchResults.length > 0 && (
        <ul className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-input-glow z-50 overflow-hidden">
          {searchResults.map((user) => (
            <li key={user.userId}>
              <button
                type="button"
                onClick={() => handleSelectUser(user)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-chat-background transition-colors cursor-pointer"
              >
                <span className="size-8 rounded-full bg-chat-icon-action/60 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-chat-text-main font-medium">
                  {user.username}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
