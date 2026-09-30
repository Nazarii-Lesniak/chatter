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

      const authenticatedRequest = request as unknown as AuthenticatedRequest;

      const conversation = await conversationService.createPrivateConversation(
        authenticatedRequest.userId,
        recipientId,
      );

      const conversationView = await conversationService.getConversationById(
        conversation.id,
        authenticatedRequest.userId,
      );

      response.status(201).json({ conversation: conversationView });
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

      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        response.status(404).json({ message: 'User not found' });

        return;
      }

      console.error('Conversation creation error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/', async (request, response) => {
    try {
      const authenticatedRequest = request as unknown as AuthenticatedRequest;

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
      const authenticatedRequest = request as unknown as AuthenticatedRequest;

      const messages = await messageService.getConversationMessages(
        conversationId,
        authenticatedRequest.userId,
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

  router.get('/:conversationId', async (request, response) => {
    try {
      const authenticatedRequest = request as unknown as AuthenticatedRequest;

      const conversation = await conversationService.getConversationById(
        request.params.conversationId,
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

      if (error instanceof Error && error.message === 'FORBIDDEN') {
        response.status(403).json({ message: 'Access denied' });

        return;
      }

      console.error('Conversation details error:', error);

      response.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
