import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LumeStorage } from '@libs/storage/instance';

import { Widget } from '@utils/types';

interface WidgetState {
  widgets: null | Array<Widget>;
  fetchWidgets: (db: LumeStorage) => void;
  setWidget: (db: LumeStorage, { kind, title, content }: Widget) => void;
  removeWidget: (db: LumeStorage, id: string) => void;
}

export const WidgetKinds = {
  feed: 1, // NIP-01
  thread: 2, // NIP-01
  hashtag: 3, // NIP-01
  article: 4, // NIP-23
  user: 5, // NIP-01
  trendingProfiles: 6,
  trendingNotes: 7,
  file: 8, // NIP-94
  network: 9999,
  xfeed: 10000, // x is temporary state for new feed widget form
  xhashtag: 10001, // x is temporary state for new hashtag widget form
};

export const useWidgets = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: null,
      fetchWidgets: async (db: LumeStorage) => {
        const dbWidgets = await db.getWidgets();
        console.log('db widgets: ', dbWidgets);

        // default: add network widget
        dbWidgets.unshift({
          id: '9999',
          title: 'Network',
          content: '',
          kind: WidgetKinds.network,
        });

        set({ widgets: dbWidgets });
      },
      setWidget: async (db: LumeStorage, { kind, title, content }: Widget) => {
        const widget: Widget = await db.createWidget(kind, title, content);
        set((state) => ({ widgets: [...state.widgets, widget] }));
      },
      removeWidget: async (db: LumeStorage, id: string) => {
        await db.removeWidget(id);
        set((state) => ({ widgets: state.widgets.filter((widget) => widget.id !== id) }));
      },
    }),
    {
      name: 'widgets',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
