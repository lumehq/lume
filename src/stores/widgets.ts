import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LumeStorage } from '@libs/storage/instance';

import { Widget, WidgetGroup } from '@utils/types';

interface WidgetState {
  widgets: null | Array<Widget>;
  isFetched: boolean;
  fetchWidgets: (db: LumeStorage) => void;
  setWidget: (db: LumeStorage, { kind, title, content }: Widget) => void;
  removeWidget: (db: LumeStorage, id: string) => void;
  reorderWidget: (id: string, position: number) => void;
  setIsFetched: () => void;
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
    notification: 107,
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
  other: {
    learnNostr: 90000,
  },
  tmp: {
    list: 10000,
    xfeed: 10001,
    xhashtag: 10002,
  },
};

export const DefaultWidgets: Array<WidgetGroup> = [
  {
    title: 'Circles / Follows',
    data: [
      {
        kind: WidgetKinds.tmp.xfeed,
        title: 'Group feeds',
        description: 'All posts from specific people you want to keep up with',
      },
      {
        kind: WidgetKinds.local.files,
        title: 'Files',
        description: 'All files shared by people in your circle',
      },
      {
        kind: WidgetKinds.local.articles,
        title: 'Articles',
        description: 'All articles shared by people in your circle',
      },
      {
        kind: WidgetKinds.local.follows,
        title: 'Follows',
        description: 'All posts from people you are following',
      },
    ],
  },
  {
    title: 'Global',
    data: [
      {
        kind: WidgetKinds.tmp.xhashtag,
        title: 'Hashtag',
        description: 'All posts have a specific hashtag',
      },
      {
        kind: WidgetKinds.global.files,
        title: 'Files',
        description: 'All files shared by people in your current relay set',
      },
      {
        kind: WidgetKinds.global.articles,
        title: 'Articles',
        description: 'All articles shared by people in your current relay set',
      },
    ],
  },
  {
    title: 'nostr.band',
    data: [
      {
        kind: WidgetKinds.nostrBand.trendingAccounts,
        title: 'Accounts',
        description: 'Trending accounts from the last 24 hours',
      },
      {
        kind: WidgetKinds.nostrBand.trendingNotes,
        title: 'Notes',
        description: 'Trending notes from the last 24 hours',
      },
    ],
  },
  {
    title: 'Other',
    data: [
      {
        kind: WidgetKinds.local.notification,
        title: 'Notification',
        description: 'Everything happens around you',
      },
      {
        kind: WidgetKinds.other.learnNostr,
        title: 'Learn Nostr',
        description: 'All things you need to know about Nostr',
      },
    ],
  },
];

export const useWidgets = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: null,
      isFetched: false,
      fetchWidgets: async (db: LumeStorage) => {
        const dbWidgets = await db.getWidgets();

        /*
        dbWidgets.unshift({
          id: '9998',
          title: 'Notification',
          content: '',
          kind: WidgetKinds.local.notification,
        });
        */

        dbWidgets.unshift({
          id: '9999',
          title: '',
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
      reorderWidget: (id: string, position: number) => {
        set((state) => {
          const widgets = [...state.widgets];
          const widget = widgets.find((widget) => widget.id === id);
          if (!widget) return { widgets };

          const idx = widgets.indexOf(widget);
          widgets.splice(idx, 1);
          widgets.splice(position, 0, widget);

          return { widgets };
        });
      },
      setIsFetched: () => {
        set({ isFetched: true });
      },
    }),
    {
      name: 'widgets',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
