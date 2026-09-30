import { apiClient } from './api-client';

export interface UserSearchResult {
  id: string;
  username: string;
  createdAt: string;
}

interface UserSearchResponse {
  users: UserSearchResult[];
}

export const usersApi = {
  async search(query: string): Promise<UserSearchResult[]> {
    const params = new URLSearchParams({
      q: query,
    });

    const response = await apiClient<UserSearchResponse>(
      `/users/search?${params.toString()}`,
    );

    return response.users;
  },
};
