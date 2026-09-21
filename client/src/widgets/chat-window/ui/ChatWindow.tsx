'use client';

import type { Message as MessageType } from '@/entities/chat';
import { useChatStore } from '@/entities/chat';
import { Message } from '@/entities/message';
import { User } from '@/entities/user';
import { ChatActions } from '@/features/chat-actions/ui/ChatActions';
import { MessageInput } from '@/features/send-message';

const EMPTY_MESSAGES: MessageType[] = [];

export function ChatWindow() {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const activeChat = useChatStore((state) =>
    state.chats.find((c) => c.id === activeChatId),
  );

  const currentUserId = useChatStore((state) => state.currentUserId);

  const messages = useChatStore((state) =>
    activeChatId && state.messages[activeChatId]
      ? state.messages[activeChatId]
      : EMPTY_MESSAGES,
  );

  if (!activeChatId) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow">
      <div className="flex justify-between w-full pb-2 md:pb-3 lg:pb-4">
        {activeChat && (
          <User user={activeChat} variant="chatWindow">
            <User.Avatar />
            <User.Info>
              <User.Username />
              <User.LastSeen />
            </User.Info>
          </User>
        )}

        <ChatActions />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-3 my-2 p-3 scrollbar-thin">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId;

          return (
            <Message
              key={message.id}
              className={isOwn ? 'self-end items-end' : 'self-start'}
            >
              <Message.Bubble variant={isOwn ? 'own' : 'companion'}>
                {message.text}
              </Message.Bubble>
              <Message.Timestamp>{message.timestamp}</Message.Timestamp>
            </Message>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
}
