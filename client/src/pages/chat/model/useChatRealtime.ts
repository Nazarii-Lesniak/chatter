import { useEffect, useEffectEvent, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useConversationStore } from '@/entities/conversation';
import { useMessageStore } from '@/entities/message';
import { useAuthStore } from '@/entities/user';
import {
  type ClientWebSocketEvent,
  useChatWebSocket,
  type WebSocketStatus,
} from '@/shared/api';
import { handleServerEvent } from './handle-server-event';

function useConversationRooms(
  status: WebSocketStatus,
  send: (event: ClientWebSocketEvent) => boolean,
) {
  const conversationIds = useConversationStore(
    useShallow((state) => state.conversations.map(({ id }) => id)),
  );
  const joinedIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (status !== 'open') {
      joinedIdsRef.current.clear();

      return;
    }

    for (const conversationId of conversationIds) {
      if (
        !joinedIdsRef.current.has(conversationId) &&
        send({ type: 'conversation:join', payload: { conversationId } })
      ) {
        joinedIdsRef.current.add(conversationId);
      }
    }
  }, [status, conversationIds, send]);
}

function useActiveConversationMessages(activeConversationId: string | null) {
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const reset = useMessageStore((state) => state.reset);

  useEffect(() => {
    if (activeConversationId) {
      void fetchMessages(activeConversationId);
    } else {
      reset();
    }
  }, [activeConversationId, fetchMessages, reset]);
}

function useResyncAfterReconnect(
  status: WebSocketStatus,
  activeConversationId: string | null,
) {
  const hasBeenOpenRef = useRef(false);

  const resync = useEffectEvent(() => {
    void useConversationStore.getState().fetchConversations({ silent: true });

    if (activeConversationId) {
      void useMessageStore
        .getState()
        .fetchMessages(activeConversationId, { silent: true });
    }
  });

  useEffect(() => {
    if (status !== 'open') {
      return;
    }

    if (hasBeenOpenRef.current) {
      resync();
    }

    hasBeenOpenRef.current = true;
  }, [status]);
}

export function useChatRealtime() {
  const isSignedIn = useAuthStore((state) => state.user !== null);
  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId,
  );

  const { status, send } = useChatWebSocket(isSignedIn, handleServerEvent);

  useConversationRooms(status, send);
  useActiveConversationMessages(activeConversationId);
  useResyncAfterReconnect(status, activeConversationId);

  const sendMessage = (content: string) => {
    if (!activeConversationId) {
      return false;
    }

    useMessageStore.getState().setSendError(null);

    return send({
      type: 'message:send',
      payload: { conversationId: activeConversationId, content },
    });
  };

  return { isConnected: status === 'open', sendMessage };
}
