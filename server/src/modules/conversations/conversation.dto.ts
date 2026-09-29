import type { PublicUser } from '../users/user.dto';
import type { Conversation } from './conversation.types';

export interface ConversationView extends Conversation {
  participant: PublicUser;
}
