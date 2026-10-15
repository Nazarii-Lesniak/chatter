'use client';

import { authApi } from '@/shared/api';
import { AuthForm } from './AuthForm';

export function LoginForm() {
  return (
    <AuthForm
      submit={authApi.login}
      submitLabel="Sign in"
      usernamePlaceholder="Your username"
      passwordPlaceholder="Your password"
      passwordAutoComplete="current-password"
    />
  );
}
