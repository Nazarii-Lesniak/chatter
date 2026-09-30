import { Router } from 'express';
import type { AuthenticatedRequest } from '../../auth/auth.middleware';
import type { UserService } from './user.service';

export function createUserRouter(userService: UserService) {
  const router = Router();

  router.get('/search', async (request, response) => {
    try {
      const query = typeof request.query.q === 'string' ? request.query.q : '';

      const authenticatedRequest = request as unknown as AuthenticatedRequest;

      const users = await userService.searchUsers(
        query,
        authenticatedRequest.userId,
      );

      response.status(200).json({ users });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'SEARCH_QUERY_TOO_SHORT'
      ) {
        response
          .status(400)
          .json({ message: 'Search query must contain at least 2 characters' });

        return;
      }

      console.error('User search error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
