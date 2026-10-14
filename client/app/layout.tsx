import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import type { ReactNode } from 'react';
import '@/app/styles/globals.css';
import { AuthProvider } from '@/app/providers';

const roboto = Roboto({
  variable: '--font-roboto-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: 'Chatter', template: '%s · Chatter' },
  description: 'Real-time chat application',
};

export const viewport: Viewport = {
  themeColor: '#6e00ff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
