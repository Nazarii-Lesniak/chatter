import { useEffect, useState } from 'react';
import { type UserDto, usersApi } from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/get-error-message';
import { useDebouncedValue } from '@/shared/lib/hooks';

const DEBOUNCE_MS = 300;
export const MIN_QUERY_LENGTH = 2;

interface SearchResult {
  term: string;
  users: UserDto[];
  error: string | null;
}

export function useUserSearch(query: string) {
  const term = query.trim();
  const debouncedTerm = useDebouncedValue(term, DEBOUNCE_MS);
  const [result, setResult] = useState<SearchResult | null>(null);

  const isOpen = term.length >= MIN_QUERY_LENGTH;
  const canSearch = debouncedTerm.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!canSearch) {
      return;
    }

    const controller = new AbortController();

    usersApi.search(debouncedTerm, controller.signal).then(
      (users) => setResult({ term: debouncedTerm, users, error: null }),
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            term: debouncedTerm,
            users: [],
            error: getErrorMessage(error, 'Failed to search users'),
          });
        }
      },
    );

    return () => controller.abort();
  }, [debouncedTerm, canSearch]);

  const isCurrent = isOpen && result?.term === term;

  return {
    isOpen,
    isLoading: isOpen && !isCurrent,
    users: isCurrent ? result.users : [],
    error: isCurrent ? result.error : null,
  };
}
