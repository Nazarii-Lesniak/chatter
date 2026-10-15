import { RegisterForm } from '@/features/auth';
import { ROUTES } from '@/shared/config';
import { CenteredCard } from '@/shared/ui/centered-card';

export function RegisterPage() {
  return (
    <CenteredCard
      title="Create account"
      subtitle="Join Chatter and start messaging"
      footerText="Already have an account?"
      footerHref={ROUTES.login}
      footerLinkText="Sign in"
    >
      <RegisterForm />
    </CenteredCard>
  );
}
