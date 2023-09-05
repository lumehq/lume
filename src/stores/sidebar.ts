import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarState {
  feeds: boolean;
  chats: boolean;
  toggleFeeds: () => void;
  toggleChats: () => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      feeds: true,
      chats: true,
      toggleFeeds: () => set((state) => ({ feeds: !state.feeds })),
      toggleChats: () => set((state) => ({ chats: !state.chats })),
    }),
    {
      name: 'sidebar',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
