const API_URL = '/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }
  } catch {}

  return 'Request failed';
}

export async function apiClient<T = void>(
  path: string,
  { body, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  const hasBody = body !== undefined;

  if (hasBody && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: requestHeaders,
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError('Cannot reach the server. Please try again.', 0);
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }
  const text = await response.text();

  return (text ? JSON.parse(text) : undefined) as T;
}
