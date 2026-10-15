import { useEffect, useEffectEvent, useRef } from 'react';

interface UseStickToBottomOptions {
  itemCount: number;
  resetKey: string | null;
  isReady: boolean;
  forceOnNewItem?: boolean;
}

export function useStickToBottom<T extends HTMLElement>({
  itemCount,
  resetKey,
  isReady,
  forceOnNewItem,
}: UseStickToBottomOptions) {
  const containerRef = useRef<T | null>(null);
  const isPinnedRef = useRef(true);
  const lastResetKeyRef = useRef<string | null | undefined>(undefined);

  const onScroll = () => {
    const element = containerRef.current;

    if (element) {
      const distanceFromBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight;

      isPinnedRef.current = distanceFromBottom <= element.clientHeight;
    }
  };

  const syncScroll = useEffectEvent((key: string | null) => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    if (lastResetKeyRef.current !== key) {
      lastResetKeyRef.current = key;
      isPinnedRef.current = true;
      element.scrollTop = element?.scrollHeight;

      return;
    }

    if (isPinnedRef.current || forceOnNewItem) {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      isPinnedRef.current = true;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  });

  useEffect(() => {
    if (isReady) {
      syncScroll(resetKey);
    }
  }, [itemCount, resetKey, isReady]);

  return { containerRef, onScroll };
}
