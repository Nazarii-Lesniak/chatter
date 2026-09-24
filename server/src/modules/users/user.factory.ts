import { randomUUID } from 'node:crypto';

import type { User } from './user.types';

export function createUser(username: string, passwordHash: string): User {
  return {
    id: randomUUID(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
}
