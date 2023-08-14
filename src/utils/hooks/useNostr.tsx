import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKPrivateKeySigner,
  NDKSubscription,
  NDKUser,
} from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { useQueryClient } from '@tanstack/react-query';
import destr from 'destr';
import { LRUCache } from 'lru-cache';
import { NostrFetcher } from 'nostr-fetch';
import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { updateAccount } from '@libs/storage';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function useNostr() {
  const { ndk, relayUrls } = useNDK();
  const { account } = useAccount();

  const queryClient = useQueryClient();
  const privkey = useStronghold((state) => state.privkey);
  const fetcher = useMemo(() => NostrFetcher.withCustomPool(ndkAdapter(ndk)), [ndk]);
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
        const user = ndk.getUser({ hexpubkey: account.pubkey });
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

      await updateAccount('follows', [...follows]);
      await updateAccount('network', [...new Set([...follows, ...network])]);

      queryClient.invalidateQueries(['currentAccount']);

      return { status: 'ok' };
    } catch (e) {
      return { status: 'failed', message: e };
    }
  };

  const fetchNotes = async (since: number) => {
    try {
      if (!ndk) return { status: 'failed', message: 'NDK instance not found' };

      const events = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [1],
          authors: account.network ?? account.follows,
        },
        { since: since }
      );

      return { status: 'ok', notes: events };
    } catch (e) {
      console.error('failed get notes, error: ', e);
      return { status: 'failed', message: e };
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
    event.pubkey = account.pubkey;
    event.tags = tags;

    await event.sign(signer);
    await event.publish();

    return event;
  };

  const createZap = async (event: NDKEvent, amount: number, message?: string) => {
    // @ts-expect-error, LumeEvent to NDKEvent
    event.id = event.event_id;

    // @ts-expect-error, LumeEvent to NDKEvent
    if (typeof event.content !== 'string') event.content = event.content.original;

    if (typeof event.tags === 'string') event.tags = destr(event.tags);

    if (!privkey) throw new Error('Private key not found');

    if (!ndk.signer) {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
    }

    // @ts-expect-error, LumeEvent to NDKEvent
    const ndkEvent = new NDKEvent(ndk, event);
    const res = await ndkEvent.zap(amount, message ?? 'zap from lume');

    return res;
  };

  return { sub, fetchUserData, fetchNotes, publish, createZap };
}
