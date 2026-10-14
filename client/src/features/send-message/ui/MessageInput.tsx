'use client';

import {
  CameraIcon,
  PaperclipIcon,
  SendHorizontal,
  SmileIcon,
} from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface MessageInputProps {
  onSend: (content: string) => boolean;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState('');

  const content = value.trim();
  const canSend = content.length > 0 && !disabled;

  const send = () => {
    if (canSend && onSend(content)) {
      setValue('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    send();
  };

  return (
    <Input variant="message">
      <Input.Icon>
        <Button
          variant="addon"
          aria-label="Attach file"
          disabled
          title="Coming soon"
        >
          <PaperclipIcon aria-hidden="true" />
        </Button>
      </Input.Icon>

      <Input.Textarea
        aria-label="Type your message"
        placeholder="Type your message here..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        enterKeyHint="send"
      />

      <Input.Icon>
        <Button
          variant="addon"
          aria-label="Select emoji"
          disabled
          title="Coming soon"
        >
          <SmileIcon aria-hidden="true" />
        </Button>
      </Input.Icon>
      <Input.Icon>
        <Button
          variant="addon"
          aria-label="Select photo"
          disabled
          title="Coming soon"
        >
          <CameraIcon aria-hidden="true" />
        </Button>
      </Input.Icon>
      <Input.Icon>
        <Button
          variant="action"
          aria-label="Send message"
          onClick={send}
          disabled={!canSend}
        >
          <SendHorizontal aria-hidden="true" />
        </Button>
      </Input.Icon>
    </Input>
  );
}
