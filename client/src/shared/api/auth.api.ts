import { apiClient } from './api-client';
import type { Credentials, UserDto } from './types';

interface AuthResponse {
  user: UserDto;
}

export const authApi = {
  async login(credentials: Credentials): Promise<UserDto> {
    const { user } = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    return user;
  },

  async register(credentials: Credentials): Promise<UserDto> {
    const { user } = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials,
    });

    return user;
  },

  async getCurrentUser(): Promise<UserDto> {
    const { user } = await apiClient<AuthResponse>('/auth/me');

    return user;
  },

  async logout(): Promise<void> {
    await apiClient('/auth/logout', { method: 'POST' });
  },

  async createWebSocketTicket(): Promise<string> {
    const { ticket } = await apiClient<{ ticket: string }>('/auth/ws-ticket', {
      method: 'POST',
    });

    return ticket;
  },
};
