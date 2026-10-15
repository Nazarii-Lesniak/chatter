import { useEffect } from 'react';
import { useConversationStore } from '@/entities/conversation';
import { useMessageStore } from '@/entities/message';
import { useAuthStore, usePresenceStore } from '@/entities/user';
import { setUnauthorizedHandler } from '@/shared/api';

export function useSessionLifecycle() {
  useEffect(() => {
    setUnauthorizedHandler(() => useAuthStore.getState().clearSession());

    const unsubscribe = useAuthStore.subscribe((state, previousState) => {
      if (previousState.user && !state.user) {
        useConversationStore.getState().reset();
        useMessageStore.getState().reset();
        usePresenceStore.getState().reset();
      }
    });

    return () => {
      setUnauthorizedHandler(null);
      unsubscribe();
    };
  }, []);
}
