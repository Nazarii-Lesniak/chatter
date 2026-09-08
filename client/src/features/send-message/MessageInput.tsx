import { CameraIcon, PaperclipIcon, SmileIcon } from 'lucide-react';
import * as Input from '@/shared/ui/input/Input';

export default function MessageInput() {
  return (
    <Input.Root variant="message">
      <Input.Icon>
        <button
          type="button"
          className="text-chat-text-main hover:text-chat-text-main/80 transition-colors cursor-pointer"
        >
          <PaperclipIcon
            aria-label="Attach file"
            className="size-6 md:size-8 lg:size-10"
          />
        </button>
      </Input.Icon>

      <Input.Textarea placeholder="Type your message here..." />

      <Input.Icon>
        <button
          type="button"
          className="text-chat-text-main hover:text-chat-text-main/80 transition-colors cursor-pointer"
        >
          <SmileIcon
            aria-label="Select Emoji"
            className="size-6 md:size-8 lg:size-10"
          />
        </button>
      </Input.Icon>
      <Input.Icon>
        <button
          type="button"
          className="text-chat-text-main hover:text-chat-text-main/80 transition-colors cursor-pointer"
        >
          <CameraIcon
            aria-label="Select photo"
            className="size-6 md:size-8 lg:size-10"
          />
        </button>
      </Input.Icon>
    </Input.Root>
  );
}
