import { CameraIcon, PaperclipIcon, SmileIcon } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

interface MessageInputProps {
  onSend: (content: string) => boolean;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
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

    if (!content || disabled) {
      return;
    }

    const sent = onSend(content);

    if (sent) {
      setValue('');
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
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
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
