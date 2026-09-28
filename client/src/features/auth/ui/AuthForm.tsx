'use client';

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
  return (
    <form className="flex flex-col gap-4 md:gap-5 w-full">
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
          />
        </Input>
      </div>

      <Button type="submit" variant="auth">
        {submitText}
      </Button>
    </form>
  );
}
