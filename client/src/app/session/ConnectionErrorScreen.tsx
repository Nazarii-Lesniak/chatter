import { Button } from '@/shared/ui/button';
import { FullScreen } from '@/shared/ui/full-screen';

interface ConnectionErrorScreenProps {
  onRetry: () => void;
}

export function ConnectionErrorScreen({ onRetry }: ConnectionErrorScreenProps) {
  return (
    <FullScreen className="flex-col p-4 text-center">
      <div
        role="alert"
        className="w-full max-w-sm flex flex-col gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-input-glow"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-base md:text-lg font-semibold text-chat-text-main">
            Can't reach Chatter
          </h2>
          <p className="text-xs md:text-sm text-chat-text-muted leading-relaxed">
            The server may still be waking up, or your connection is down. Your
            session is safe, please try again in a moment.
          </p>
        </div>

        <Button variant="primary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </FullScreen>
  );
}
