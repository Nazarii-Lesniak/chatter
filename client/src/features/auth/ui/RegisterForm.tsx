'use client';

import { authApi } from '@/shared/api';
import { AuthForm } from './AuthForm';

export function RegisterForm() {
  return (
    <AuthForm
      submit={authApi.register}
      submitLabel="Create account"
      usernamePlaceholder="Enter your name"
      passwordPlaceholder="Create a password"
      passwordAutoComplete="new-password"
    />
  );
}
