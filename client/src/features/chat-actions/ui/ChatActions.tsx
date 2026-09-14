import { CallButton } from '@/features/call-user/ui/CallButton';
import { ChatMenuButton } from '@/features/open-chat-menu/ui/ChatMenuButton';
import { VideoCallButton } from '@/features/video-call-user/ui/VideoCallButton';

export function ChatActions() {
  return (
    <div className="flex items-center gap-8">
      <CallButton />
      <VideoCallButton />
      <ChatMenuButton />
    </div>
  );
}
