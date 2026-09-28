import { Router } from 'express';
import type { AuthenticatedRequest } from '../../auth/auth.middleware';
import type { MessageService } from '../messages/message.service';
import type { ConversationService } from './conversation.service';

export function createConversationRouter(
  conversationService: ConversationService,
  messageService: MessageService,
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

  router.get('/', async (request, response) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;

      const conversations = await conversationService.getUserConversations(
        authenticatedRequest.userId,
      );

      response.status(200).json({ conversations });
    } catch (error) {
      console.error('Conversation list error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/:conversationId/messages', async (request, response) => {
    try {
      const { conversationId } = request.params;
      const userId = request.userId;

      if (!userId) {
        response.status(401).json({ message: 'Authentication required' });

        return;
      }

      const messages = await messageService.getConversationMessages(
        conversationId,
        userId,
      );

      response.status(200).json({ messages });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'CONVERSATION_NOT_FOUND'
      ) {
        response.status(404).json({ message: 'Conversation not found' });

        return;
      }

      if (error instanceof Error && error.message === 'FORBIDDEN') {
        response.status(403).json({ message: 'Access denied' });

        return;
      }

      console.error('Get conversation messages error:', error);
      response.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/:conversationid', async (request, response) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;

      const conversation = await conversationService.getConversationById(
        request.params.conversationid,
        authenticatedRequest.userId,
      );

      response.status(200).json({ conversation });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'CONVERSATION_NOT_FOUND'
      ) {
        response.status(404).json({ message: 'Conversation not found' });

        return;
      }

      console.error('Conversation details error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
