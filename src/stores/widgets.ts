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
  local: {
    network: 100,
    feeds: 101,
    files: 102,
    articles: 103,
    user: 104,
    thread: 105,
    follows: 106,
  },
  global: {
    feeds: 1000,
    files: 1001,
    articles: 1002,
    hashtag: 1003,
  },
  nostrBand: {
    trendingAccounts: 1,
    trendingNotes: 2,
  },
  tmp: {
    list: 10000,
    xfeed: 10001,
    xhashtag: 10002,
  },
};

export const DefaultWidgets = [
  {
    title: 'Network / Follows',
    data: [
      {
        kind: WidgetKinds.tmp.xfeed,
        title: 'Group feeds',
      },
      {
        kind: WidgetKinds.local.files,
        title: 'Files',
      },
      {
        kind: WidgetKinds.local.articles,
        title: 'Articles',
      },
      {
        kind: WidgetKinds.local.follows,
        title: 'Follows',
      },
    ],
  },
  {
    title: 'Global',
    data: [
      {
        kind: WidgetKinds.tmp.xhashtag,
        title: 'Hashtag',
      },
      {
        kind: WidgetKinds.global.files,
        title: 'Files',
      },
      {
        kind: WidgetKinds.global.articles,
        title: 'Articles',
      },
    ],
  },
  {
    title: 'Trending (nostr.band)',
    data: [
      {
        kind: WidgetKinds.nostrBand.trendingAccounts,
        title: 'Accounts',
      },
      {
        kind: WidgetKinds.nostrBand.trendingNotes,
        title: 'Notes',
      },
    ],
  },
];

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
          kind: WidgetKinds.local.network,
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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
