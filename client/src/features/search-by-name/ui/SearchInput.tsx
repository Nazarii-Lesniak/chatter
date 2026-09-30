'use client';

import { SearchIcon, X } from 'lucide-react';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { UserSearchResult } from '@/shared/api/users';
import { usersApi } from '@/shared/api/users';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

interface SearchInputProps {
  onSelectUser: (user: UserSearchResult) => void;
}

export function SearchInput({ onSelectUser }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRequestId = useRef(0);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      setUsers([]);
      setIsLoading(false);
      setError(null);

      return;
    }

    const requestId = ++searchRequestId.current;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await usersApi.search(normalizedQuery);

        if (requestId !== searchRequestId.current) {
          return;
        }

        setUsers(results);
      } catch (error) {
        if (requestId !== searchRequestId.current) {
          return;
        }

        setUsers([]);
        setError(
          error instanceof Error ? error.message : 'Failed to search users',
        );
      } finally {
        if (requestId === searchRequestId.current) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleClear = () => {
    setQuery('');
    setUsers([]);
    setError(null);
  };

  const handleSelectUser = (user: UserSearchResult) => {
    onSelectUser(user);
    setQuery('');
    setUsers([]);
  };

  const showDropdown = query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="relative hidden md:hidden lg:flex lg:flex-col lg:w-full">
      <Input.Root variant="search">
        <Input.Icon>
          <Button variant="search" type="button">
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

      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-input-glow z-50 overflow-hidden">
          {isLoading && (
            <p className="px-4 py-3 text-sm text-chat-text-muted">
              Searching...
            </p>
          )}

          {!isLoading && error && (
            <p className="px-4 py-3 text-sm text-red-500">{error}</p>
          )}

          {!isLoading && !error && users.length === 0 && (
            <p className="px-4 py-3 text-sm text-chat-text-muted">
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
      )}
    </div>
  );
}
