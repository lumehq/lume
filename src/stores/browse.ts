import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BrowseState {
  data: Array<{ title: string; data: string[] }>;
  setData: ({ title, data }: { title: string; data: string[] }) => void;
}

export const useBrowse = create<BrowseState>()(
  persist(
    (set) => ({
      data: [],
      setData: (data) => {
        set((state) => ({ data: [...state.data, data] }));
      },
    }),
    {
      name: 'browseUsers',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
