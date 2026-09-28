'use client';

import { SearchIcon, X } from 'lucide-react';
import { type ChangeEvent, useCallback, useRef, useState } from 'react';
import type { UserType } from '@/entities/user/model/types';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

const DEBOUNCE_MS = 300;

export function SearchInput() {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mockUser: UserType[] = [
    {
      id: '1',
      username: 'Nazar',
      createdAt: 'today',
      status: 'online',
    },
  ];

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {}, DEBOUNCE_MS);
  }, []);

  const handleClear = () => {
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

      {true && (
        <ul className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-input-glow z-50 overflow-hidden">
          {mockUser.map((_user) => (
            <li key={1}>
              <button
                type="button"
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-chat-background transition-colors cursor-pointer"
              >
                <span className="size-8 rounded-full bg-chat-icon-action/60 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  N
                </span>
                <span className="text-sm text-chat-text-main font-medium">
                  Nazar
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
