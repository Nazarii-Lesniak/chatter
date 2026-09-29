'use client';

import { SearchIcon, X } from 'lucide-react';
import { type ChangeEvent, useCallback, useRef, useState } from 'react';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

const DEBOUNCE_MS = 300;

export function SearchInput() {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    </div>
  );
}
