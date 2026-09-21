import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthCardLayoutProps {
  title: string;
  subtitle: string;
  formComponent: ReactNode;
  footerText: string;
  footerLinkHref: '/login' | '/register';
  footerLinkText: string;
}

export function AuthCardLayout({
  title,
  subtitle,
  formComponent,
  footerText,
  footerLinkHref,
  footerLinkText,
}: AuthCardLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs md:max-w-md lg:max-w-sm bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-input-glow p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-chat-text-main tracking-tight">
            {title}
          </h1>
          <p className="text-xs md:text-sm lg:text-sm text-chat-text-muted">
            {subtitle}
          </p>
        </div>

        {formComponent}

        <p className="text-center text-xs md:text-sm lg:text-sm text-chat-text-muted">
          {footerText}{' '}
          <Link
            href={footerLinkHref}
            className="text-chat-purple font-medium hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
