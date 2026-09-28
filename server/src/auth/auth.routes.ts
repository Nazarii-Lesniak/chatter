import { Router } from 'express';
import { createAccessTokenCookie } from './auth.cookie';
import type { AuthService } from './auth.service';

export function createAuthRouter(authService: AuthService) {
  const router = Router();

  router.post('/register', async (request, response) => {
    try {
      const { username, password } = request.body;

      const user = await authService.register({
        username,
        password,
      });

      const token = authService.createAccessToken(user.id);

      response.setHeader('Set-Cookie', createAccessTokenCookie(token));

      response.status(201).json({ user });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'USERNAME_ALREADY_EXISTS'
      ) {
        response.status(409).json({ message: 'Username already exists' });

        return;
      }

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/login', async (request, response) => {
    try {
      const { username, password } = request.body;

      const user = await authService.login({ username, password });

      const token = authService.createAccessToken(user.id);

      response.setHeader('Set-Cookie', createAccessTokenCookie(token));

      response.status(200).json({ user });
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        response.status(401).json({
          message: 'Invalid credentials',
        });

        return;
      }

      response.status(500).json({
        message: 'Internal server error',
      });
    }
  });

  return router;
}
