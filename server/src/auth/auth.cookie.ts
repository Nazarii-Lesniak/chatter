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
  const isProduction = process.env.NODE_ENV === 'production';

  const parts = [
    `access_token=${encodeURIComponent(token)}`,
    isProduction && 'Secure',
    isProduction ? 'SameSite=None' : 'SameSite=Lax',
    'HttpOnly',
    'Path=/',
    'Max-Age=900',
  ];

  return parts.filter(Boolean).join('; ');
}

export function createClearAccessTokenCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production';

  const parts = [
    'access_token=',
    isProduction && 'Secure',
    isProduction ? 'SameSite=None' : 'SameSite=Lax',
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];

  return parts.filter(Boolean).join('; ');
}
