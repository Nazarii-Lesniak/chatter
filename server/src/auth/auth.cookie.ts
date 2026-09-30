import { env } from '../config/env';

export function getCookie(
  cookieHeader: string | undefined,
  name: string,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');

    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }

  return null;
}

export function createAccessTokenCookie(token: string): string {
  const sameSite = env.isProduction ? 'None' : 'Lax';
  const secure = env.isProduction ? 'Secure' : '';

  return [
    `access_token=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    `SameSite=${sameSite}`,
    'MaxAge=604800',
    secure,
  ]
    .filter(Boolean)
    .join('; ');
}
