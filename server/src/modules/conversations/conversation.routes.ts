import { Router } from 'express';
import type { AuthenticatedRequest } from '../../auth/auth.middleware';
import type { ConversationService } from './conversation.service';

export function createConversationRouter(
  conversationService: ConversationService,
) {
  const router = Router();

  router.post('/', async (request, response) => {
    try {
      const { recipientId } = request.body;

      const authenticatedRequest = request as AuthenticatedRequest;

      const conversation = await conversationService.createPrivateConversation(
        authenticatedRequest.userId,
        recipientId,
      );

      response.status(201).json({ conversation });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'CONVERSATION_REQUIRES_TWO_USERS'
      ) {
        response
          .status(400)
          .json({ message: 'Conversation requires two different users' });

        return;
      }

      console.error('Conversation creation error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
