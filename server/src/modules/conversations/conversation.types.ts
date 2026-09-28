export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  conversationId: string;
  userId: string;
  joinedAt: string;
}
