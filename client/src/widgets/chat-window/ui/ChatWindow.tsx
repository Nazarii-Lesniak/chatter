'use client';

import { Message } from '@/entities/message';
import { User } from '@/entities/user';
import type { UserType } from '@/entities/user/model/types';
import { ChatActions } from '@/features/chat-actions/ui/ChatActions';
import { MessageInput } from '@/features/send-message';

export function ChatWindow() {
  const mockUser: UserType = {
    id: '1',
    username: 'Nazar',
    createdAt: 'today',
    status: 'online',
  };

  return (
    <div className="flex flex-col w-full h-full p-3 gap-3 rounded-2xl flex-1 md:p-5 md:gap-4 md:rounded-3xl lg:p-6 lg:gap-6 lg:rounded-3xl lg:flex-1 bg-white items-stretch justify-between max-w-full shadow-input-glow">
      <div className="flex justify-between w-full pb-2 md:pb-3 lg:pb-4">
        {true && (
          <User user={mockUser} variant="chatWindow">
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
        {[].map((_message) => {
          const isOwn = true;

          return (
            <Message
              key={1}
              className={isOwn ? 'self-end items-end' : 'self-start'}
            >
              <Message.Bubble variant={isOwn ? 'own' : 'companion'}>
                Hy there!
              </Message.Bubble>
              <Message.Timestamp>Today</Message.Timestamp>
            </Message>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
}
