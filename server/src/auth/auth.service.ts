import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { type PublicUser, toPublicUser } from '../modules/users/user.dto';
import { createUser } from '../modules/users/user.factory';
import type { UserRepository } from '../modules/users/user.repository';
import type {
  LoginInput,
  RegisterInput,
  User,
} from '../modules/users/user.types';

export interface AccessTokenPayload {
  userId: string;
}

export interface WebSocketTicketPayload {
  userId: string;
  type: 'websocket';
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput): Promise<PublicUser> {
    const existingUser = await this.userRepository.findByUsername(
      input.username,
    );

    if (existingUser) {
      throw new Error('USERNAME_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = createUser(input.username, passwordHash);

    await this.userRepository.create(user);

    return this.toAuthUser(user);
  }

  async login(input: LoginInput): Promise<PublicUser> {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
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
        expiresIn: '30d',
      },
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      const payload = jwt.verify(token, env.jwtSecret);

      if (
        typeof payload !== 'object' ||
        payload === null ||
        typeof payload.userId !== 'string' ||
        payload.type !== undefined
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

  createWebSocketTicket(userId: string): string {
    return jwt.sign(
      {
        userId,
        type: 'websocket',
      },
      env.jwtSecret,
      {
        expiresIn: '60s',
      },
    );
  }

  verifyWebSocketTicket(token: string): WebSocketTicketPayload | null {
    try {
      const payload = jwt.verify(token, env.jwtSecret);

      if (
        typeof payload !== 'object' ||
        payload === null ||
        typeof payload.userId !== 'string' ||
        payload.type !== 'websocket'
      ) {
        return null;
      }

      return {
        userId: payload.userId,
        type: 'websocket',
      };
    } catch {
      return null;
    }
  }

  async getUserById(id: string): Promise<PublicUser | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return this.toAuthUser(user);
  }

  private toAuthUser(user: User): PublicUser {
    return toPublicUser(user);
  }
}
