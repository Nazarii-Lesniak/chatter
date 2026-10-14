import Link from 'next/link';
import { ROUTES } from '@/shared/config';
import { FullScreen } from '@/shared/ui/full-screen';

export function NotFoundPage() {
  return (
    <FullScreen className="flex-col gap-4 p-4 text-center">
      <h1 className="text-lg font-semibold text-chat-text-main">
        Page not found
      </h1>
      <Link
        href={ROUTES.home}
        className="text-sm font-medium text-chat-purple hover:underline"
      >
        Back to Chatter
      </Link>
    </FullScreen>
  );
}
