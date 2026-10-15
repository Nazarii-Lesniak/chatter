import { ArrowLeft } from 'lucide-react';
import { useConversationStore } from '@/entities/conversation';
import { User, type UserSummary } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { ChatActions } from './ChatActions';

interface ChatWindowHeaderProps {
  companion: UserSummary;
}

export function ChatWindowHeader({ companion }: ChatWindowHeaderProps) {
  const closeConversation = useConversationStore(
    (state) => state.closeConversation,
  );

  return (
    <header className="flex justify-between w-full pb-3 md:pb-4 border-b border-chat-background">
      <div className="flex items-center gap-2">
        <Button
          variant="addon"
          aria-label="Back to contacts"
          onClick={closeConversation}
          className="md:hidden"
        >
          <ArrowLeft aria-hidden="true" />
        </Button>

        <User user={companion} variant="default">
          <User.Avatar />
          <User.Info>
            <User.Username />
            <User.Status />
          </User.Info>
        </User>
      </div>

      <ChatActions />
    </header>
  );
}
