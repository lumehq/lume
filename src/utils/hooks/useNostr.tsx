import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKPrivateKeySigner,
  NDKSubscription,
  NDKUser,
} from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { LRUCache } from 'lru-cache';
import { NostrFetcher } from 'nostr-fetch';
import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { nHoursAgo } from '@utils/date';

export function useNostr() {
  const { ndk, relayUrls } = useNDK();
  const { db } = useStorage();

  const privkey = useStronghold((state) => state.privkey);
  const subManager = useMemo(
    () =>
      new LRUCache<string, NDKSubscription, void>({
        max: 4,
        dispose: (sub) => sub.stop(),
      }),
    []
  );

  const sub = async (
    filter: NDKFilter,
    callback: (event: NDKEvent) => void,
    closeOnEose?: boolean
  ) => {
    if (!ndk) throw new Error('NDK instance not found');

    const subEvent = ndk.subscribe(filter, { closeOnEose: closeOnEose ?? true });
    subManager.set(JSON.stringify(filter), subEvent);

    subEvent.addListener('event', (event: NDKEvent) => {
      callback(event);
    });
  };

  const fetchUserData = async (preFollows?: string[]) => {
    try {
      const follows = new Set<string>(preFollows || []);
      const lruNetwork = new LRUCache<string, string, void>({ max: 300 });

      // fetch user's follows
      if (!preFollows) {
        const user = ndk.getUser({ hexpubkey: db.account.pubkey });
        const list = await user.follows();
        list.forEach((item: NDKUser) => {
          follows.add(nip19.decode(item.npub).data as string);
        });
      }

      // build user's network
      const events = await ndk.fetchEvents({
        kinds: [3],
        authors: [...follows],
        limit: 300,
      });

      events.forEach((event: NDKEvent) => {
        event.tags.forEach((tag) => {
          if (tag[0] === 'p') lruNetwork.set(tag[1], tag[1]);
        });
      });

      const network = [...lruNetwork.values()] as string[];

      await db.updateAccount('follows', [...follows]);
      await db.updateAccount('network', [...new Set([...follows, ...network])]);

      // clear lru caches
      lruNetwork.clear();

      return { status: 'ok', message: 'User data fetched' };
    } catch (e) {
      return { status: 'failed', message: e };
    }
  };

  const prefetchEvents = async () => {
    try {
      if (!ndk) return { status: 'failed', data: [], message: 'NDK instance not found' };

      const fetcher = NostrFetcher.withCustomPool(ndkAdapter(ndk));
      const dbEventsEmpty = await db.isEventsEmpty();

      let since: number;
      if (dbEventsEmpty || db.account.last_login_at === 0) {
        since = nHoursAgo(24);
      } else {
        since = db.account.last_login_at ?? nHoursAgo(24);
      }

      console.log("prefetching events with user's network: ", db.account.network.length);
      console.log('prefetching events since: ', since);

      const events = fetcher.allEventsIterator(
        relayUrls,
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
          authors: db.account.network,
        },
        { since: since }
      );

      // save all events to database
      for await (const event of events) {
        let root: string;
        let reply: string;
        if (event.tags?.[0]?.[0] === 'e' && !event.tags?.[0]?.[3]) {
          root = event.tags[0][1];
        } else {
          root = event.tags.find((el) => el[3] === 'root')?.[1];
          reply = event.tags.find((el) => el[3] === 'reply')?.[1];
        }
        db.createEvent(
          event.id,
          JSON.stringify(event),
          event.pubkey,
          event.kind,
          root,
          reply,
          event.created_at
        );
      }

      return { status: 'ok', data: [], message: 'prefetch completed' };
    } catch (e) {
      console.error('prefetch events failed, error: ', e);
      return { status: 'failed', data: [], message: e };
    }
  };

  const publish = async ({
    content,
    kind,
    tags,
  }: {
    content: string;
    kind: NDKKind | number;
    tags: string[][];
  }): Promise<NDKEvent> => {
    if (!privkey) throw new Error('Private key not found');

    const event = new NDKEvent(ndk);
    const signer = new NDKPrivateKeySigner(privkey);

    event.content = content;
    event.kind = kind;
    event.created_at = Math.floor(Date.now() / 1000);
    event.pubkey = db.account.pubkey;
    event.tags = tags;

    await event.sign(signer);
    await event.publish();

    return event;
  };

  const createZap = async (event: NDKEvent, amount: number, message?: string) => {
    if (!privkey) throw new Error('Private key not found');

    if (!ndk.signer) {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
    }

    // @ts-expect-error, NostrEvent to NDKEvent
    const ndkEvent = new NDKEvent(ndk, event);
    const res = await ndkEvent.zap(amount, message ?? 'zap from lume');

    return res;
  };

  return { sub, fetchUserData, prefetchEvents, publish, createZap };
}
