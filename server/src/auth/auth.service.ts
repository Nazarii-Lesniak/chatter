import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import type { UserRepository } from '../modules/users/user.repository';
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from '../modules/users/user.types';

export interface AccessTokenPayload {
  userId: string;
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput): Promise<AuthUser> {
    const existingUser = await this.userRepository.findByUsername(
      input.username,
    );

    if (existingUser) {
      throw new Error('USERNAME_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await this.userRepository.create({
      id: randomUUID(),
      username: input.username,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    return this.toAuthUser(user);
  }

  async login(input: LoginInput): Promise<AuthUser> {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordMathes = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMathes) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return this.toAuthUser(user);
  }

  createAccessToken(userId: string): string {
    return jwt.sign(
      {
        userId,
      },
      env.jwtSecret,
      {
        expiresIn: '15m',
      },
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      const payload = jwt.verify(token, env.jwtSecret);

      if (
        typeof payload !== 'object' ||
        payload === null ||
        typeof payload.userId !== 'string'
      ) {
        return null;
      }

      return {
        userId: payload.userId,
      };
    } catch {
      return null;
    }
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return this.toAuthUser(user);
  }

  private toAuthUser(user: {
    id: string;
    username: string;
    createdAt: string;
  }): AuthUser {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
