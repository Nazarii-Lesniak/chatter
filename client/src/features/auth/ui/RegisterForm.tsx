'use client';

import { AuthForm } from './AuthForm';

export function RegisterForm() {
  return (
    <AuthForm
      mode="register"
      submitText="Create account"
      loadingText="Creating account…"
      usernamePlaceholder="Enter your name"
      passwordPlaceholder="Create a password"
    />
  );
}
