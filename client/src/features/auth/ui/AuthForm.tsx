'use client';

import { useRouter } from 'next/navigation';
import { type SubmitEvent, useState } from 'react';
import { useAuthSrore } from '@/entities/user/model/auth.store';
import { authApi } from '@/shared/api/auth.api';
import { Button } from '@/shared/ui/button/Button';
import { Input } from '@/shared/ui/input/Input';

interface AuthFormProps {
  mode: 'login' | 'register';
  submitText: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
}

export function AuthForm({
  mode,
  submitText,
  usernamePlaceholder = 'Your username',
  passwordPlaceholder = 'Your password',
}: AuthFormProps) {
  const router = useRouter();

  const setUser = useAuthSrore((state) => state.setUser);
  const isLoading = useAuthSrore((state) => state.isLoading);
  const setLoading = useAuthSrore((state) => state.setLoading);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const user =
        mode === 'login'
          ? await authApi.login({ username, password })
          : await authApi.register({ username, password });

      setUser(user);
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4 md:gap-5 w-full"
      onSubmit={handleSubmit}
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
            placeholder={usernamePlaceholder}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={isLoading}
            required
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
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
            required
          />
        </Input>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <Button type="submit" variant="auth" disabled={isLoading}>
        {isLoading ? `${submitText}…` : submitText}
      </Button>
    </form>
  );
}
