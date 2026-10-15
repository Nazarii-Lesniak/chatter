'use client';

import { useActionState, useId } from 'react';
import { useAuthStore } from '@/entities/user';
import type { Credentials, UserDto } from '@/shared/api';
import { getErrorMessage } from '@/shared/lib/get-error-message';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface AuthFormProps {
  submit: (credentials: Credentials) => Promise<UserDto>;
  submitLabel: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  passwordAutoComplete: 'current-password' | 'new-password';
}

interface FormState {
  error: string | null;
  username: string;
}

const LABEL_CLASS =
  'text-xs md:text-sm font-medium text-chat-text-main tracking-wide';

export function AuthForm({
  submit,
  submitLabel,
  usernamePlaceholder,
  passwordPlaceholder,
  passwordAutoComplete,
}: AuthFormProps) {
  const id = useId();
  const setUser = useAuthStore((state) => state.setUser);

  const [state, formAction, isPending] = useActionState(
    async (_previous: FormState, formData: FormData): Promise<FormState> => {
      const username = String(formData.get('username') ?? '').trim();
      const password = String(formData.get('password') ?? '');

      try {
        setUser(await submit({ username, password }));

        return { error: null, username };
      } catch (error) {
        return {
          error: getErrorMessage(error, 'Something went wrong'),
          username,
        };
      }
    },
    { error: null, username: '' },
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 md:gap-5 w-full">
      <div className="flex flex-col gap-1 md:gap-1.5">
        <label htmlFor={`${id}-username`} className={LABEL_CLASS}>
          Username
        </label>
        <Input variant="auth">
          <Input.Field
            id={`${id}-username`}
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={usernamePlaceholder}
            defaultValue={state.username}
            disabled={isPending}
            required
          />
        </Input>
      </div>

      <div className="flex flex-col gap-1 md:gap-1.5">
        <label htmlFor={`${id}-password`} className={LABEL_CLASS}>
          Password
        </label>
        <Input variant="auth">
          <Input.Field
            id={`${id}-password`}
            name="password"
            type="password"
            autoComplete={passwordAutoComplete}
            placeholder={passwordPlaceholder}
            disabled={isPending}
            required
          />
        </Input>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-chat-error">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? `${submitLabel}…` : submitLabel}
      </Button>
    </form>
  );
}
