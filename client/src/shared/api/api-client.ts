const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiClient<T>(
  path: string,
  options: ApiRequestOptions = {},
) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const data = await response.json();

      if (data && typeof data.message === 'string') {
        message = data.message;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
