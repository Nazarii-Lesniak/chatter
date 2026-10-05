'use client';

import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useConversationStore } from '@/entities/conversation/conversation.store';
import { Message } from '@/entities/message';
import { useMessageStore } from '@/entities/message/model/message.store';
import { User } from '@/entities/user';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { UserType } from '@/entities/user/model/types';
import { ChatActions } from '@/features/chat-actions/ui/ChatActions';
import { MessageInput } from '@/features/send-message';
import { cn } from '@/shared/lib/class-merge';
import {
  type ServerWebSocketEvent,
  useChatWebSocket,
} from '@/shared/lib/websocket';
import { Button } from '@/shared/ui/button/Button';

export function ChatWindow() {
  const currentUser = useAuthStore((state) => state.user);

  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId,
  );
  const conversations = useConversationStore((state) => state.conversations);
  const mobileView = useConversationStore((state) => state.mobileView);
  const goBackToContacts = useConversationStore(
    (state) => state.goBackToContacts,
  );

  const messages = useMessageStore((state) => state.messages);
  const isLoading = useMessageStore((state) => state.isLoading);
  const error = useMessageStore((state) => state.error);
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const appendMessage = useMessageStore((state) => state.appendMessage);
  const setError = useMessageStore((state) => state.setError);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const handleWebSocketEvent = useCallback(
    (event: ServerWebSocketEvent) => {
      if (event.type === 'message:new') {
        if (event.payload.message.conversationId === activeConversationId) {
          appendMessage(event.payload.message);
        }

        return;
      }

      if (event.type === 'error') {
        setError(event.payload.message);
      }
    },
    [activeConversationId, appendMessage, setError],
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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

  if (!activeConversation) {
    return (
      <div
        className={cn(
          'flex flex-col w-full h-full p-3 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl bg-white items-center justify-center shadow-input-glow',
          mobileView === 'contacts' ? 'hidden md:flex' : 'flex',
        )}
      >
        <p className="text-sm text-chat-text-muted">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  const companion: UserType = {
    id: activeConversation.participant.id,
    username: activeConversation.participant.username,
    createdAt: activeConversation.participant.createdAt,
    status: 'offline',
  };

  return (
    <div
      className={cn('flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow', 
      mobileView === 'contacts' ? 'hidden md:flex' : 'flex'
    )}
    >
      <header className="flex justify-between w-full pb-2 md:pb-3 lg:pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="addon"
            aria-label="Back to contacts"
            onClick={goBackToContacts}
            className="md:hidden"
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <User user={companion} variant="chatWindow">
            <User.Avatar />
            <User.Info>
              <User.Username />
              <User.LastSeen />
            </User.Info>
          </User>
        </div>

        <ChatActions />
      </header>
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-3 my-2 p-3 scrollbar-thin">
        {isLoading && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            Loading messages...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <p className="text-sm text-chat-text-muted text-center py-4">
            No messages yet
          </p>
        )}

        {!isLoading &&
          !error &&
          messages.map((message) => {
            const isOwn = message.senderId === currentUser?.id;

            return (
              <Message
                key={message.id}
                className={isOwn ? 'self-end items-end' : 'self-start'}
              >
                <Message.Bubble variant={isOwn ? 'own' : 'companion'}>
                  {message.content}
                </Message.Bubble>
                <Message.Timestamp>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Message.Timestamp>
              </Message>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSendMessage}
        disabled={webSocketStatus !== 'open'}
      />
    </div>
  );
}
