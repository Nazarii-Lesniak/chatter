'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import { useAuthStore } from '@/entities/user';
import type { SocketEvent } from '@/shared/types/socket';

export function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: ChangeEvent) => {
    event.preventDefault();
    setIsError(null);

    if (!username.trim() || !password.trim()) {
      setIsError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const userId = crypto.randomUUID();

    const tempSocket = new WebSocket('ws://localhost:8080');

    const cleanup = () => {
      tempSocket.close();
      setIsLoading(false);
    };

    tempSocket.onopen = () => {
      const event: SocketEvent = {
        type: 'REGISTER_USER',
        payload: {
          userId,
          username: username.trim(),
          password: password.trim(),
        },
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
          setIsError(response.payload.message);
        }
      } catch {
        cleanup();
        setIsError('Unexpected server response.');
      }
    };

    tempSocket.onerror = () => {
      cleanup();
      setIsError('Cannot connect to server. Make sure the server is running.');
    };
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-username"
          className="text-sm font-medium text-chat-text-main tracking-wide"
        >
          Username
        </label>
        <input
          id="register-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="h-12 px-4 rounded-2xl bg-chat-background shadow-input-glow outline-hidden focus:shadow-input-glow-focus transition-shadow text-chat-text-main placeholder:text-chat-text-muted text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-password"
          className="text-sm font-medium text-chat-text-main tracking-wide"
        >
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="h-12 px-4 rounded-2xl bg-chat-background shadow-input-glow outline-hidden focus:shadow-input-glow-focus transition-shadow text-chat-text-main placeholder:text-chat-text-muted text-sm"
        />
      </div>

      {isError && (
        <p className="text-sm text-red-500 text-center -mt-1">{isError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="h-12 rounded-2xl bg-chat-purple text-white font-semibold tracking-wide text-sm transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
