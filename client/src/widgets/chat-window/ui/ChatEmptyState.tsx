export function ChatEmptyState() {
  return (
    <div className="hidden md:flex flex-col w-full h-full p-3 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl bg-white items-center justify-center shadow-input-glow">
      <p className="text-sm text-chat-text-muted">
        Select a conversation to start chatting
      </p>
    </div>
  );
}
