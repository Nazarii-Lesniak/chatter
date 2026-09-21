'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import { useAuthStore } from '@/entities/user';
import type { SocketEvent } from '@/shared/types/socket';
import { Button } from '@/shared/ui/button/Button';
import { Input } from '@/shared/ui/input/Input';

interface AuthFormProps {
  mode: 'login' | 'register';
  submitText: string;
  loadingText: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
}

export function AuthForm({
  mode,
  submitText,
  loadingText,
  usernamePlaceholder = 'Your username',
  passwordPlaceholder = 'Your password',
}: AuthFormProps) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

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

    const tempSocket = new WebSocket('ws://localhost:8080');

    const cleanup = () => {
      tempSocket.close();
      setIsLoading(false);
    };

    tempSocket.onopen = () => {
      const basePayload = {
        username: username.trim(),
        password: password.trim(),
      };

      const event: SocketEvent =
        mode === 'register'
          ? {
              type: 'REGISTER_USER',
              payload: {
                ...basePayload,
                userId: crypto.randomUUID(),
              },
            }
          : {
              type: 'LOGIN_USER',
              payload: basePayload,
            };

      tempSocket.send(JSON.stringify(event));
    };

    tempSocket.onmessage = (message) => {
      try {
        const response = JSON.parse(message.data) as SocketEvent;

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 md:gap-5 w-full"
    >
      <div className="flex flex-col gap-1 md:gap-1.5">
        <label
          htmlFor={`${mode}-username`}
          className="text-xs md:text-sm font-medium text-chat-text-main tracking-wide"
        >
          Username
        </label>
        <Input variant="auth">
          <Input.Field
            id={`${mode}-username`}
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={usernamePlaceholder}
          />
        </Input>
      </div>

      <div className="flex flex-col gap-1 md:gap-1.5">
        <label
          htmlFor={`${mode}-password`}
          className="text-xs md:text-sm font-medium text-chat-text-main tracking-wide"
        >
          Password
        </label>
        <Input variant="auth">
          <Input.Field
            id={`${mode}-password`}
            type="password"
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={passwordPlaceholder}
          />
        </Input>
      </div>

      {isError && (
        <p className="text-xs md:text-sm text-red-400 text-center -mt-1">
          {isError}
        </p>
      )}

      <Button type="submit" variant="auth" disabled={isLoading}>
        {isLoading ? loadingText : submitText}
      </Button>
    </form>
  );
}
