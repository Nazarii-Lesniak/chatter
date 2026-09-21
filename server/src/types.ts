export interface UserRecord {
  userId: string;
  username: string;
  passwordHash: string;
}

export type SocketEvent =
  | { type: 'CLIENT_CONNECT'; payload: { userId: string } }
  | {
      type: 'REGISTER_USER';
      payload: { userId: string; username: string; password: string };
    }
  | {
      type: 'LOGIN_USER';
      payload: { username: string; password: string };
    }
  | {
      type: 'JOIN_CHAT';
      payload: { chatId: string; userId: string };
    }
  | {
      type: 'SEARCH_USERS';
      payload: { query: string };
    }
  | {
      type: 'SEND_MESSAGE';
      payload: { chatId: string; text: string; senderId: string };
    }
  | {
      type: 'NEW_MESSAGE';
      payload: {
        id: string;
        chatId: string;
        text: string;
        senderId: string;
        timestamp: string;
      };
    }
  | {
      type: 'USER_STATUS';
      payload: { userId: string; status: 'online' | 'offline' };
    }
  | {
      type: 'SEARCH_RESULT';
      payload: { users: Array<Pick<UserRecord, 'userId' | 'username'>> };
    }
  | {
      type: 'AUTH_SUCCESS';
      payload: { userId: string; username: string };
    }
  | {
      type: 'AUTH_ERROR';
      payload: { message: string };
    };
