import Link from 'next/link';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-input-glow p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-chat-text-main tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-chat-text-muted">
            Sign in to continue to Chatter
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-chat-text-muted">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-chat-purple font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
