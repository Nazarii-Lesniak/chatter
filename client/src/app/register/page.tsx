import { AuthCardLayout } from '@/features/auth/ui/AuthCardLayout';
import { AuthForm } from '@/features/auth/ui/AuthForm';

export default function RegisterPage() {
  return (
    <AuthCardLayout
      title="Create account"
      subtitle="Join Chatter and start messaging"
      footerText="Already have an account?"
      footerLinkHref="/login"
      footerLinkText="Sign in"
      formComponent={
        <AuthForm
          mode="register"
          submitText="Create account"
          loadingText="Creating account…"
          usernamePlaceholder="Enter your name"
          passwordPlaceholder="Create a password"
        />
      }
    />
  );
}
