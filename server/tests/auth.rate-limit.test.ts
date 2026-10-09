import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import express from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('bcrypt', () => ({
  default: {
    hash: async (password: string) => `hash:${password}`,
    compare: async (password: string, hash: string) =>
      hash === `hash:${password}`,
  },
}));

let server: Server | undefined;

async function startServer() {
  vi.resetModules();

  const { AuthService } = await import('../src/auth/auth.service.js');
  const { createAuthRouter } = await import('../src/auth/auth.routes.js');
  const { InMemoryUserRepository } = await import(
    '../src/modules/users/in-memory-user.repository.js'
  );

  const app = express();

  app.use(express.json());
  app.use(
    '/auth',
    createAuthRouter(
      new AuthService(new InMemoryUserRepository()),
      (_request, _response, next) => next(),
    ),
  );

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });

  const { port } = (server as Server).address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  const post = (path: string, body: object) =>
    fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

  return {
    register: (username: string) =>
      post('/auth/register', { username, password: 'secret123' }),
    login: (username: string, password = 'secret123') =>
      post('/auth/login', { username, password }),
  };
}

afterEach(() => {
  server?.close();
  server = undefined;
});

describe('login rate limiting', () => {
  it('blocks a username after 10 failed attempts', async () => {
    const { login } = await startServer();

    for (let attempt = 1; attempt <= 10; attempt++) {
      expect((await login('alice', 'wrong')).status).toBe(401);
    }

    const blocked = await login('alice', 'wrong');

    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({
      message: 'Too many attempts. Please try again later.',
    });
    expect(blocked.headers.get('retry-after')).not.toBeNull();
  });

  it('keeps blocking even the correct password while locked', async () => {
    const { register, login } = await startServer();

    await register('alice');

    for (let attempt = 1; attempt <= 10; attempt++) {
      await login('alice', 'wrong');
    }

    expect((await login('alice')).status).toBe(429);
  });

  it('does not affect other usernames from the same IP', async () => {
    const { register, login } = await startServer();

    await register('bob');

    for (let attempt = 1; attempt <= 11; attempt++) {
      await login('alice', 'wrong');
    }

    expect((await login('bob')).status).toBe(200);
  });

  it('does not count successful logins', async () => {
    const { register, login } = await startServer();

    await register('carol');

    for (let attempt = 1; attempt <= 12; attempt++) {
      expect((await login('carol')).status).toBe(200);
    }
  });
});

describe('register rate limiting', () => {
  it('allows 20 registrations per hour per IP and blocks the 21st', async () => {
    const { register } = await startServer();

    for (let index = 1; index <= 20; index++) {
      expect((await register(`user${index}`)).status).toBe(201);
    }

    expect((await register('user21')).status).toBe(429);
  });
});
