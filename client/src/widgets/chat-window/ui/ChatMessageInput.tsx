import { CameraIcon, PaperclipIcon, SmileIcon } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import { useConversationStore } from '@/entities/conversation';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';
import { useChatRoom } from '../model/useChatRoom';
import { ChatEmptyState } from './ChatEmptyState';

export function ChatMessageInput() {
  const { sendMessage, isConnected, activeConversation } = useChatRoom();
  const mobileView = useConversationStore((state) => state.mobileView);

  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    const content = value.trim();

    if (!content || !isConnected) {
      return;
    }

    const sent = sendMessage(content);

    if (sent) {
      setValue('');
    }
  };

  if (!activeConversation) {
    return <ChatEmptyState isMobileView={mobileView === 'contacts'} />;
  }

  return (
    <Input.Root variant="message">
      <Input.Icon>
        <Button variant="addon" aria-label="Attach file">
          <PaperclipIcon aria-hidden="true" />
        </Button>
      </Input.Icon>

      <Input.Textarea
        aria-label="Type your message"
        placeholder="Type your message here..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!isConnected}
      />

      <Input.Icon>
        <Button variant="addon" aria-label="Select Emoji">
          <SmileIcon aria-hidden="true" />
        </Button>
      </Input.Icon>
      <Input.Icon>
        <Button variant="addon" aria-label="Select photo">
          <CameraIcon aria-hidden="true" />
        </Button>
      </Input.Icon>
    </Input.Root>
  );
}
