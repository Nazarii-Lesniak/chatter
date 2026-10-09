import { useCallback, useEffect, useRef, useState } from 'react';
import { useConversationStore } from '@/entities/conversation';
import { useMessageStore } from '@/entities/message';
import type { UserType } from '@/entities/user';
import { useAuthStore } from '@/entities/user';
import {
  type ServerWebSocketEvent,
  useChatWebSocket,
} from '@/shared/lib/websocket';

export function useChatRoom() {
  const currentUser = useAuthStore((state) => state.user);

  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId,
  );
  const conversations = useConversationStore((state) => state.conversations);

  const messages = useMessageStore((state) => state.messages);
  const isLoading = useMessageStore((state) => state.isLoading);
  const error = useMessageStore((state) => state.error);
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const appendMessage = useMessageStore((state) => state.appendMessage);
  const setError = useMessageStore((state) => state.setError);

  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const updateLastMessage = useConversationStore(
    (state) => state.updateLastMessage,
  );

  const handleWebSocketEvent = useCallback(
    (event: ServerWebSocketEvent) => {
      if (event.type === 'message:new') {
        updateLastMessage(
          event.payload.message.conversationId,
          event.payload.message,
        );

        if (event.payload.message.conversationId === activeConversationId) {
          appendMessage(event.payload.message);
        }

        return;
      }

      if (event.type === 'presence:initial') {
        setOnlineUserIds(new Set(event.payload.onlineUserIds));

        return;
      }

      if (event.type === 'user:status') {
        setOnlineUserIds((prev) => {
          const newSet = new Set(prev);

          if (event.payload.status === 'online') {
            newSet.add(event.payload.userId);
          } else {
            newSet.delete(event.payload.userId);
          }

          return newSet;
        });

        return;
      }

      if (event.type === 'error') {
        setError(event.payload.message);
      }
    },
    [activeConversationId, appendMessage, setError, updateLastMessage],
  );

  const { status: webSocketStatus, send } = useChatWebSocket(
    currentUser !== null,
    handleWebSocketEvent,
  );

  const joinedConversationRef = useRef<string | null>(null);

  useEffect(() => {
    if (webSocketStatus !== 'open') {
      return;
    }

    const previousConversationId = joinedConversationRef.current;

    if (previousConversationId === activeConversationId) {
      return;
    }

    if (previousConversationId) {
      send({
        type: 'conversation:leave',
        payload: { conversationId: previousConversationId },
      });
    }

    if (activeConversationId) {
      send({
        type: 'conversation:join',
        payload: { conversationId: activeConversationId },
      });
    }

    joinedConversationRef.current = activeConversationId;
  }, [activeConversationId, send, webSocketStatus]);

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    fetchMessages(activeConversationId);
  }, [activeConversationId, fetchMessages]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeConversationId) {
        return false;
      }

      return send({
        type: 'message:send',
        payload: {
          conversationId: activeConversationId,
          content,
        },
      });
    },
    [activeConversationId, send],
  );

  const isCompanionOnline = activeConversation
    ? onlineUserIds.has(activeConversation.participant.id)
    : false;

  const companion: UserType | undefined = activeConversation
    ? {
        id: activeConversation.participant.id,
        username: activeConversation.participant.username,
        createdAt: activeConversation.participant.createdAt,
        status: isCompanionOnline ? 'online' : 'offline',
      }
    : undefined;

  const isConnected = webSocketStatus === 'open';

  return {
    activeConversation,
    companion,
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    isConnected,
  };
}
