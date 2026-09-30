import { type PublicUser, toPublicUser } from './user.dto';
import type { UserRepository } from './user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async searchUsers(
    query: string,
    currentUserId: string,
  ): Promise<PublicUser[]> {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      throw new Error('SEARCH_QUERY_TOO_SHORT');
    }

    const users = await this.userRepository.searchByUsername(
      normalizedQuery,
      10,
    );

    return users.filter((user) => user.id !== currentUserId).map(toPublicUser);
  }
}
