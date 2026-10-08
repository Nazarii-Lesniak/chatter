export default function ConnectingFallback() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-chat-background p-4 text-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-input-glow">
        <div className="size-10 rounded-full border-3 border-chat-sidebar/20 border-t-chat-sidebar animate-spin" />
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
    </div>
  );
}
