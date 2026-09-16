export type SocketEvent =
  | { type: 'CLIENT_CONNECT'; payload: { userId: string } }
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
    };
