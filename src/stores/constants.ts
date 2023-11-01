import { WidgetGroup } from '@utils/types';

export const FULL_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relayable.org',
  'wss://relay.nostr.band/all',
  'wss://nostr.mutinywallet.com',
];

export const FETCH_LIMIT = 50;

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
    title: 'Local',
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
    ],
  },
];
