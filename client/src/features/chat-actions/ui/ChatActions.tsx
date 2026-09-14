import { CallButton } from '@/features/call-user/ui/CallButton';
import { ChatMenuButton } from '@/features/open-chat-menu/ui/ChatMenuButton';
import { VideoCallButton } from '@/features/video-call-user/ui/VideoCallButton';

export function ChatActions() {
  return (
    <div className="flex items-center gap-2 md:gap-4 lg:gap-5">
      <CallButton />
      <VideoCallButton />
      <ChatMenuButton />
    </div>
  );
}
