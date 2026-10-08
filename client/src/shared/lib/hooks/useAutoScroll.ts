import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAutoScrollProps {
  messages: unknown[];
  isLoading: boolean;
}

export function useAutoScroll({ messages, isLoading }: UseAutoScrollProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const _count = messages.length;

    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  return {
    messagesEndRef,
    isScrolling,
    handleScroll,
  };
}
