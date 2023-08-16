import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKPrivateKeySigner,
  NDKSubscription,
  NDKUser,
} from '@nostr-dev-kit/ndk';
import { LRUCache } from 'lru-cache';
import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { nHoursAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

interface NotesResponse {
  status: string;
  data: LumeEvent[];
  nextCursor?: number;
  message?: string;
}

export function useNostr() {
  const { ndk } = useNDK();
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
      const events = await ndk.fetchEvents({ kinds: [3], authors: [...follows] });
      events.forEach((event: NDKEvent) => {
        event.tags.forEach((tag) => {
          if (tag[0] === 'p') lruNetwork.set(tag[1], tag[1]);
        });
      });

      const network = [...lruNetwork.values()] as string[];

      await db.updateAccount('follows', [...follows]);
      await db.updateAccount('network', [...new Set([...follows, ...network])]);

      return { status: 'ok' };
    } catch (e) {
      return { status: 'failed', message: e };
    }
  };

  const fetchNotes = async (since: number): Promise<NotesResponse> => {
    try {
      if (!ndk) return { status: 'failed', data: [], message: 'NDK instance not found' };

      console.log('fetch all events since: ', since);
      const events = await ndk.fetchEvents({
        kinds: [1],
        authors: db.account.network ?? db.account.follows,
        since: nHoursAgo(since),
      });

      const sorted = [...events].sort(
        (a, b) => b.created_at - a.created_at
      ) as unknown as LumeEvent[];

      return { status: 'ok', data: sorted, nextCursor: since * 2 };
    } catch (e) {
      console.error('failed get notes, error: ', e);
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

  return { sub, fetchUserData, fetchNotes, publish, createZap };
}
