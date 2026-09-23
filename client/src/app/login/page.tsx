import { AuthCardLayout } from '@/features/auth/ui/AuthCardLayout';
import { AuthForm } from '@/features/auth/ui/AuthForm';

export default function LoginPage() {
  return (
    <AuthCardLayout
      title="Welcome back"
      subtitle="Sign in to continue to Chatter"
      footerText="Don't have an account?"
      footerLinkHref="/register"
      footerLinkText="Create one"
      formComponent={
        <AuthForm
          mode="login"
          submitText="Sign in"
          usernamePlaceholder="Your username"
          passwordPlaceholder="Your password"
        />
      }
    />
  );
}
