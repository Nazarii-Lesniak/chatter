'use client';

import { Button } from '@/shared/ui/button';
import { FullScreen } from '@/shared/ui/full-screen';

interface ErrorPageProps {
  onRetry: () => void;
}

export function ErrorPage({ onRetry }: ErrorPageProps) {
  return (
    <FullScreen className="flex-col gap-4 p-4 text-center">
      <h1 className="text-lg font-semibold text-chat-text-main">
        Something went wrong
      </h1>
      <p className="text-sm text-chat-text-muted">
        An unexpected error occurred. You can try again.
      </p>
      <Button variant="primary" className="px-8" onClick={onRetry}>
        Try again
      </Button>
    </FullScreen>
  );
}
