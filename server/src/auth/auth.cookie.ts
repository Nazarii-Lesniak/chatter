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
    'HttpOnly',
    'Path=/',
    isProduction ? 'SameSite=None' : 'SameSite=Lax',
    'MaxAge=900',
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  return parts.join('; ');
}
