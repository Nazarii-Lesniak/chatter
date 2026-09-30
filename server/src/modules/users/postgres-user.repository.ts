import type { Pool } from 'pg';
import type { UserRepository } from './user.repository';
import type { User } from './user.types';

interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly database: Pool) {}

  async create(user: User): Promise<User> {
    const result = await this.database.query<UserRow>(
      `
      INSERT INTO users (
          id,
          username,
          password_hash,
          created_at
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, password_hash, created_at
    `,
      [user.id, user.username, user.passwordHash, user.createdAt],
    );

    return toUser(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.database.query<UserRow>(
      `
        SELECT id, username, password_hash, created_at
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? toUser(result.rows[0]) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.database.query<UserRow>(
      `
        SELECT id, username, password_hash, created_at
        FROM users
        WHERE username = $1
      `,
      [username],
    );

    return result.rows[0] ? toUser(result.rows[0]) : null;
  }

  async searchByUsername(query: string, limit = 10): Promise<User[]> {
    const result = await this.database.query<UserRow>(
      `
        SELECT id, username, password_hash, created_at
        FROM users
        WHERE username ILIKE $1
        ORDER BY username
        LIMIT $2
      `,
      [`%${query}%`, limit],
    );

    return result.rows.map(toUser);
  }
}
