export interface UserDto {
  id: string;
  username: string;
  createdAt: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ConversationDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  participant: UserDto;
  lastMessage?: MessageDto | null;
}

export interface Credentials {
  username: string;
  password: string;
}
