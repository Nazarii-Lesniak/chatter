'use client';

import { AuthForm } from './AuthForm';

export function RegisterForm() {
  return (
    <AuthForm
      mode="register"
      submitText="Create account"
      usernamePlaceholder="Enter your name"
      passwordPlaceholder="Create a password"
    />
  );
}
