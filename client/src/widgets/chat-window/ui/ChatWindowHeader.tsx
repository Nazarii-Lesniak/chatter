import { ArrowLeft } from 'lucide-react';
import { useConversationStore } from '@/entities/conversation';
import { User } from '@/entities/user';
import { ChatActions } from '@/features/chat-actions';
import { Button } from '@/shared/ui/button/Button';
import { useChatRoom } from '../model/useChatRoom';

export function ChatWindowHeader() {
  const goBackToContacts = useConversationStore(
    (state) => state.goBackToContacts,
  );

  const { companion } = useChatRoom();

  if (!companion) {
    return null;
  }

  return (
    <header className="flex justify-between w-full pb-3 md:pb-4 border-b border-chat-background">
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
  );
}
