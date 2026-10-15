'use client';

import { SearchIcon, X } from 'lucide-react';
import { type FocusEvent, type KeyboardEvent, useState } from 'react';
import { UserAvatar } from '@/entities/user';
import type { UserDto } from '@/shared/api';
import { Input } from '@/shared/ui/input';
import { useUserSearch } from '../model/useUserSearch';

interface SearchInputProps {
  onSelectUser: (user: UserDto) => void;
}

export function SearchInput({ onSelectUser }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);
  const { isOpen, isLoading, users, error } = useUserSearch(query);

  const showDropdown = isOpen && !isDismissed;

  const handleClear = () => {
    setQuery('');
  };

  const handleSelectUser = (user: UserDto) => {
    onSelectUser(user);
    setQuery('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsDismissed(true);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDismissed(true);
    }
  };

  return (
    <search
      className="relative flex flex-col w-full"
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <Input variant="search">
        <Input.Icon className="size-7 md:size-8 lg:size-9 p-1 md:p-1.5 lg:p-2 shrink-0 text-chat-icon-search">
          <SearchIcon aria-hidden="true" className="size-full" />
        </Input.Icon>
        <Input.Field
          type="search"
          placeholder="Search users…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsDismissed(false);
          }}
          onFocus={() => setIsDismissed(false)}
          aria-label="Search users by name"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <Input.Icon>
            <button
              type="button"
              onClick={handleClear}
              className="text-chat-text-muted hover:text-chat-text-main transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </Input.Icon>
        )}
      </Input>

      {showDropdown && (
        <div
          onMouseDown={(event) => event.preventDefault()}
          className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-input-glow z-50 overflow-hidden"
          role="listbox"
        >
          {isLoading && (
            <p role="status" className="px-4 py-3 text-sm text-chat-text-muted">
              Searching...
            </p>
          )}

          {!isLoading && error && (
            <p role="alert" className="px-4 py-3 text-sm text-chat-error">
              {error}
            </p>
          )}

          {!isLoading && !error && users.length === 0 && (
            <p role="status" className="px-4 py-3 text-sm text-chat-text-muted">
              No users found
            </p>
          )}

          {!isLoading && !error && users.length > 0 && (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-chat-background focus-visible:bg-chat-background transition-colors cursor-pointer"
                  >
                    <UserAvatar
                      username={user.username}
                      size="sm"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-chat-text-main font-medium">
                      {user.username}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </search>
  );
}
