import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createAuthMiddleware } from '../src/auth/auth.middleware';
import { createAuthRouter } from '../src/auth/auth.routes';
import { AuthService } from '../src/auth/auth.service';
import { InMemoryUserRepository } from '../src/modules/users/in-memory-user.repository';

const USER_ID = 'user-1';

describe('auth middleware (POST /auth/ws-ticket)', () => {
  let server: Server;
  let baseUrl: string;
  let authService: AuthService;

  const requestTicket = (headers: Record<string, string> = {}) =>
    fetch(`${baseUrl}/auth/ws-ticket`, { method: 'POST', headers });

  beforeAll(async () => {
    authService = new AuthService(new InMemoryUserRepository());

    const app = express();

    app.use(express.json());
    app.use(
      '/auth',
      createAuthRouter(authService, createAuthMiddleware(authService)),
    );

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });

    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(() => {
    server.close();
  });

  it('rejects a request without credentials', async () => {
    expect((await requestTicket()).status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const response = await requestTicket({ authorization: 'Bearer garbage' });

    expect(response.status).toBe(401);
  });

  it('accepts an access token from the cookie', async () => {
    const token = authService.createAccessToken(USER_ID);
    const response = await requestTicket({ cookie: `access_token=${token}` });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ticket: expect.any(String) });
  });

  it('accepts an access token from the Authorization header', async () => {
    const token = authService.createAccessToken(USER_ID);
    const response = await requestTicket({ authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
  });

  it('does not let a WebSocket ticket mint new tickets', async () => {
    const ticket = authService.createWebSocketTicket(USER_ID);

    const asBearer = await requestTicket({ authorization: `Bearer ${ticket}` });
    const asCookie = await requestTicket({ cookie: `access_token=${ticket}` });

    expect(asBearer.status).toBe(401);
    expect(asCookie.status).toBe(401);
  });
});
