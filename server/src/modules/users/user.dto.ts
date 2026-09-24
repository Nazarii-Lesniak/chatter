import type { User } from './user.types';

export interface PublicUser {
  id: string;
  username: string;
  createdAt: string;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}
