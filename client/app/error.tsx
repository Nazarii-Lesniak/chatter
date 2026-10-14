'use client';

import { ErrorPage } from '@/pages/error';

export default function RouteError({ reset }: { reset: () => void }) {
  return <ErrorPage onRetry={reset} />;
}
