import { create } from 'zustand';
import type { UserStatus } from './types';

interface PresenceState {
  onlineUserIds: ReadonlySet<string>;

  setOnlineUsers: (userIds: readonly string[]) => void;
  setUserStatus: (userId: string, status: UserStatus) => void;
  reset: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUserIds: new Set(),

  setOnlineUsers: (userIds) => set({ onlineUserIds: new Set(userIds) }),

  setUserStatus: (userId, status) =>
    set((state) => {
      const isOnline = state.onlineUserIds.has(userId);

      if (isOnline === (status === 'online')) {
        return state;
      }

      const onlineUserIds = new Set(state.onlineUserIds);

      if (status === 'online') {
        onlineUserIds.add(userId);
      } else {
        onlineUserIds.delete(userId);
      }

      return { onlineUserIds };
    }),

  reset: () => set({ onlineUserIds: new Set() }),
}));

export function useUserStatus(userId: string | undefined): UserStatus {
  return usePresenceStore(
    (state) => userId !== undefined && state.onlineUserIds.has(userId),
  )
    ? 'online'
    : 'offline';
}
