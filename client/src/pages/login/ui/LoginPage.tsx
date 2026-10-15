import { LoginForm } from '@/features/auth';
import { ROUTES } from '@/shared/config';
import { CenteredCard } from '@/shared/ui/centered-card';

export function LoginPage() {
  return (
    <CenteredCard
      title="Welcome back"
      subtitle="Sign in to continue to Chatter"
      footerText="Don't have an account?"
      footerHref={ROUTES.register}
      footerLinkText="Create one"
    >
      <LoginForm />
    </CenteredCard>
  );
}
