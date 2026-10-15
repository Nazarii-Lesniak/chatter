import { useConversationStore } from '@/entities/conversation';
import { useMessageStore } from '@/entities/message';
import { usePresenceStore } from '@/entities/user';
import type { ServerWebSocketEvent } from '@/shared/api';

export function handleServerEvent(event: ServerWebSocketEvent): void {
  switch (event.type) {
    case 'message:new': {
      const { message } = event.payload;

      useConversationStore.getState().updateLastMessage(message);
      useMessageStore.getState().appendMessage(message);

      break;
    }

    case 'presence:initial':
      usePresenceStore.getState().setOnlineUsers(event.payload.onlineUserIds);

      break;

    case 'user:status':
      usePresenceStore
        .getState()
        .setUserStatus(event.payload.userId, event.payload.status);

      break;

    case 'error':
      useMessageStore.getState().setSendError(event.payload.message);

      break;

    default:
      break;
  }
}
