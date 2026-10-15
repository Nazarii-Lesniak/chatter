import { FullScreen } from '@/shared/ui/full-screen';
import { Spinner } from '@/shared/ui/spinner';

export function ConnectingScreen() {
  return (
    <FullScreen className="flex-col p-4 text-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-input-glow">
        <Spinner size="lg" />
        <div className="flex flex-col gap-2">
          <h2 className="text-base md:text-lg font-semibold text-chat-text-main">
            Connecting to Chatter
          </h2>
          <p className="text-xs md:text-sm text-chat-text-muted leading-relaxed">
            Please note: Initial page load may take up to 1 minute while the
            database and server wake up from sleep mode. Thank you for your
            patience!
          </p>
        </div>
      </div>
    </FullScreen>
  );
}
