import Link from 'next/link';
import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-input-glow p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-chat-text-main tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-chat-text-muted">
            Join Chatter and start messaging
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-chat-text-muted">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-chat-purple font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
