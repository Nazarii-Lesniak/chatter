import { apiClient } from './api-client';
import type { UserDto } from './types';

export const usersApi = {
  async search(query: string, signal?: AbortSignal): Promise<UserDto[]> {
    const params = new URLSearchParams({ q: query });

    const { users } = await apiClient<{ users: UserDto[] }>(
      `/users/search?${params}`,
      { signal },
    );

    return users;
  },
};
