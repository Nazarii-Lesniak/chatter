import { CameraIcon, PaperclipIcon, SmileIcon } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '@/entities/chat';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

export function MessageInput() {
  const [text, setText] = useState('');
  const addMessage = useChatStore((state) => state.addMessage);
  const activeChatId = useChatStore((state) => state.activeChatId);

  const handleSend = () => {
    if (!text.trim() || !activeChatId) return;
    addMessage(activeChatId, {
      id: crypto.randomUUID(),
      text: text.trim(),
      senderId: 'me',
      timestamp:
        'Today, ' +
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
    });
    setText('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Input.Root variant="message">
      <Input.Icon>
        <Button variant="addon">
          <PaperclipIcon aria-label="Attach file" />
        </Button>
      </Input.Icon>

      <Input.Textarea
        placeholder="Type your message here..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Input.Icon>
        <Button variant="addon">
          <SmileIcon aria-label="Select Emoji" />
        </Button>
      </Input.Icon>
      <Input.Icon>
        <Button variant="addon">
          <CameraIcon aria-label="Select photo" />
        </Button>
      </Input.Icon>
    </Input.Root>
  );
}
