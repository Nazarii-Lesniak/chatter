export interface ConversationParticipant {
  id: string;
  username: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  participant: ConversationParticipant;
}
