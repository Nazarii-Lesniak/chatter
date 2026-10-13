import { API_ORIGIN } from '@/shared/config';

const WEBSOCKET_PATH = '/ws';

export function buildSocketUrl(ticket: string, origin: string = API_ORIGIN) {
  const url = new URL(WEBSOCKET_PATH, origin);

  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.searchParams.set('ticket', ticket);

  return url.toString();
}
