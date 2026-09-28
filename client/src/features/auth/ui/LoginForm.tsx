'use client';

import { AuthForm } from './AuthForm';

export function LoginForm() {
  return (
    <AuthForm
      mode="login"
      submitText="Sign in"
      usernamePlaceholder="Your username"
      passwordPlaceholder="Your password"
    />
  );
}
