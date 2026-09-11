import { CameraIcon, PaperclipIcon, SmileIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';
import * as Input from '@/shared/ui/input/Input';

export default function MessageInput() {
  return (
    <Input.Root variant="message">
      <Input.Icon>
        <Button variant="addon">
          <PaperclipIcon aria-label="Attach file" />
        </Button>
      </Input.Icon>

      <Input.Textarea placeholder="Type your message here..." />

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
