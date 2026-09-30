import type { UserRepository } from './user.repository';
import type { User } from './user.types';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }

    return null;
  }

  async searchByUsername(query: string, limit = 10): Promise<User[]> {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const users: User[] = [];

    for (const user of this.users.values()) {
      if (user.username.toLowerCase().includes(normalizedQuery)) {
        users.push(user);
      }

      if (users.length >= limit) {
        break;
      }
    }

    return users;
  }
}
