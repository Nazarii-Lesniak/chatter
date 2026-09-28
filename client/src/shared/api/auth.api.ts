import { apiClient } from './api-client';

export interface AuthUser {
  id: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
}

export const authApi = {
  async login(input: LoginInput): Promise<AuthUser> {
    const response = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
    })

    return response.user;
  },

  async register(input: RegisterInput): Promise<AuthUser> {
    const response = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
    })

    return response.user;
  }
}
