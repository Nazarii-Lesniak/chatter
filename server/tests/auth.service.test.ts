import jwt from 'jsonwebtoken';
import { beforeAll, describe, expect, it } from 'vitest';

import { AuthService } from '../src/auth/auth.service';
import { InMemoryUserRepository } from '../src/modules/users/in-memory-user.repository';
import type { PublicUser } from '../src/modules/users/user.dto';

const JWT_SECRET = 'test-secret';
const PASSWORD = 'secret123';

describe('AuthService', () => {
  let repository: InMemoryUserRepository;
  let service: AuthService;
  let alice: PublicUser;
  let aliceId: string;

  beforeAll(async () => {
    repository = new InMemoryUserRepository();
    service = new AuthService(repository);

    alice = await service.register({
      username: 'alice',
      password: PASSWORD,
    });

    aliceId = alice.id;
  });

  describe('register', () => {
    it('returns the public user without the password hash', () => {
      expect(alice).toMatchObject({
        id: expect.any(String),
        username: 'alice',
      });
      expect(alice).not.toHaveProperty('passwordHash');
    });

    it('stores a bcrypt hash instead of the plain password', async () => {
      const stored = await repository.findByUsername('alice');

      expect(stored?.passwordHash).not.toBe(PASSWORD);
      expect(stored?.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    });

    it('rejects a username that is already taken', async () => {
      await expect(
        service.register({ username: 'alice', password: 'another-password' }),
      ).rejects.toThrow('USERNAME_ALREADY_EXISTS');
    });
  });

  describe('login', () => {
    it('returns the user for correct credentials', async () => {
      const user = await service.login({
        username: 'alice',
        password: PASSWORD,
      });

      expect(user.id).toBe(aliceId);
    });

    it('rejects a wrong password', async () => {
      await expect(
        service.login({ username: 'alice', password: 'wrong' }),
      ).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('returns the same error for an unknown user (no user enumeration)', async () => {
      await expect(
        service.login({ username: 'nobody', password: PASSWORD }),
      ).rejects.toThrow('INVALID_CREDENTIALS');
    });
  });

  describe('access token', () => {
    it('can be created and verified', () => {
      const token = service.createAccessToken(aliceId);

      expect(service.verifyAccessToken(token)).toEqual({ userId: aliceId });
    });

    it('is valid for 30 days', () => {
      const token = service.createAccessToken(aliceId);
      const { iat, exp } = jwt.decode(token) as { iat: number; exp: number };

      expect(exp - iat).toBe(30 * 24 * 60 * 60);
    });

    it('rejects garbage', () => {
      expect(service.verifyAccessToken('not-a-token')).toBeNull();
    });

    it('rejects a token signed with another secret', () => {
      const forged = jwt.sign({ userId: aliceId }, 'another-secret');

      expect(service.verifyAccessToken(forged)).toBeNull();
    });

    it('rejects an expired token', () => {
      const expired = jwt.sign({ userId: aliceId }, JWT_SECRET, {
        expiresIn: -10,
      });

      expect(service.verifyAccessToken(expired)).toBeNull();
    });

    it('rejects a WebSocket ticket', () => {
      expect(service.verifyAccessToken(service.createWebSocketTicket(aliceId))).toBeNull();
    });
  });

  describe('WebSocket ticket', () => {
    it('can be created and verified', () => {
      const ticket = service.createWebSocketTicket(aliceId);

      expect(service.verifyWebSocketTicket(ticket)).toEqual({
        userId: aliceId,
        type: 'websocket',
      });
    });

    it('lives for 60 seconds only', () => {
      const ticket = service.createWebSocketTicket(aliceId);
      const { iat, exp } = jwt.decode(ticket) as { iat: number; exp: number };

      expect(exp - iat).toBe(60);
    });

    it('rejects a regular access token', () => {
      const accessToken = service.createAccessToken(aliceId);

      expect(service.verifyWebSocketTicket(accessToken)).toBeNull();
    });

    it('rejects an expired ticket', () => {
      const expired = jwt.sign(
        { userId: aliceId, type: 'websocket' },
        JWT_SECRET,
        { expiresIn: -10 },
      );

      expect(service.verifyWebSocketTicket(expired)).toBeNull();
    });
  });

  describe('input validation', () => {
    it.todo('rejects an empty username');
    it.todo('rejects a whitespace-only username');
    it.todo('rejects a password shorter than the minimum length');
    it.todo('rejects a username longer than the database column allows');
  });
});
