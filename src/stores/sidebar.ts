import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarState {
  feeds: boolean;
  chats: boolean;
  communities: boolean;
  integrations: boolean;
  toggleFeeds: () => void;
  toggleChats: () => void;
  toggleCommunities: () => void;
  toggleIntegrations: () => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      feeds: true,
      chats: false,
      communities: true,
      integrations: true,
      toggleFeeds: () => set((state) => ({ feeds: !state.feeds })),
      toggleChats: () => set((state) => ({ chats: !state.chats })),
      toggleCommunities: () => set((state) => ({ communities: !state.communities })),
      toggleIntegrations: () => set((state) => ({ integrations: !state.integrations })),
    }),
    {
      name: 'sidebar',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
