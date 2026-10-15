import { useCallback, useEffect, useRef, useState } from 'react';

export function useScrollActivity(idleMs = 1000) {
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const onScroll = useCallback(() => {
    setIsScrolling(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setIsScrolling(false), idleMs);
  }, [idleMs]);

  return { isScrolling, onScroll };
}
