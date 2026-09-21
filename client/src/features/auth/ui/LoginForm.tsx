'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import { useAuthStore } from '@/entities/user';
import type { SocketEvent } from '@/shared/types/socket';

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: ChangeEvent) => {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    const tempSocket = new WebSocket('ws://localhost:8080');

    const cleanup = () => {
      tempSocket.close();
      setIsLoading(false);
    };

    tempSocket.onopen = () => {
      const event: SocketEvent = {
        type: 'LOGIN_USER',
        payload: { username: username.trim(), password: password.trim() },
      };
      tempSocket.send(JSON.stringify(event));
    };

    tempSocket.onmessage = (msg) => {
      try {
        const response = JSON.parse(msg.data) as SocketEvent;

        if (response.type === 'AUTH_SUCCESS') {
          cleanup();
          login(response.payload.userId, response.payload.username);
          router.push('/');
        } else if (response.type === 'AUTH_ERROR') {
          cleanup();
          setError(response.payload.message);
        }
      } catch {
        cleanup();
        setError('Unexpected server response.');
      }
    };

    tempSocket.onerror = () => {
      cleanup();
      setError('Cannot connect to server. Make sure the server is running.');
    };
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-username"
          className="text-sm font-medium text-chat-text-main tracking-wide"
        >
          Username
        </label>
        <input
          id="login-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          className="h-12 px-4 rounded-2xl bg-chat-background shadow-input-glow outline-hidden focus:shadow-input-glow-focus transition-shadow text-chat-text-main placeholder:text-chat-text-muted text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-chat-text-main tracking-wide"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="h-12 px-4 rounded-2xl bg-chat-background shadow-input-glow outline-hidden focus:shadow-input-glow-focus transition-shadow text-chat-text-main placeholder:text-chat-text-muted text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center -mt-1">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="h-12 rounded-2xl bg-chat-purple text-white font-semibold tracking-wide text-sm transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
