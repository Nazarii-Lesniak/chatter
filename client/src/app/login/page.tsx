import Link from 'next/link';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs md:max-w-md lg:max-w-sm bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-input-glow p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-chat-text-main tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs md:text-sm lg:text-sm text-chat-text-muted">
            Sign in to continue to Chatter
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs md:text-sm lg:text-sm text-chat-text-muted">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-chat-purple font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
