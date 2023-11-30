import NDK, {
  NDKEvent,
  NDKKind,
  NDKNip46Signer,
  NDKPrivateKeySigner,
} from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { useQueryClient } from '@tanstack/react-query';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';
import { NostrFetcher } from 'nostr-fetch';
import { useEffect, useState } from 'react';

import NDKCacheAdapterTauri from '@libs/ndk/cache';
import { useStorage } from '@libs/storage/provider';

import { FETCH_LIMIT } from '@stores/constants';

export const NDKInstance = () => {
  const { db } = useStorage();
  const queryClient = useQueryClient();

  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [fetcher, setFetcher] = useState<NostrFetcher | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

  async function getSigner(nsecbunker?: boolean) {
    if (!db.account) return;

    // NIP-46 Signer
    if (nsecbunker) {
      const localSignerPrivkey = await db.secureLoad(db.account.pubkey + '-nsecbunker');
      if (!localSignerPrivkey) return null;
      const localSigner = new NDKPrivateKeySigner(localSignerPrivkey);
      // await remoteSigner.blockUntilReady();
      return new NDKNip46Signer(ndk, db.account.id, localSigner);
    }

    // Private Key Signer
    const userPrivkey = await db.secureLoad(db.account.pubkey);
    if (!userPrivkey) return null;
    return new NDKPrivateKeySigner(userPrivkey);
  }

  async function initNDK() {
    try {
      const outboxSetting = await db.getSettingValue('outbox');
      const bunkerSetting = await db.getSettingValue('nsecbunker');

      const bunker = !!parseInt(bunkerSetting);
      const outbox = !!parseInt(outboxSetting);

      const signer = await getSigner(bunker);
      const explicitRelayUrls = await db.getExplicitRelayUrls();

      const tauriAdapter = new NDKCacheAdapterTauri(db);
      const instance = new NDK({
        explicitRelayUrls,
        cacheAdapter: tauriAdapter,
        outboxRelayUrls: ['wss://purplepag.es'],
        enableOutboxModel: outbox,
      });

      // add signer if exist
      if (signer) instance.signer = signer;

      // connect
      await instance.connect();
      const _fetcher = NostrFetcher.withCustomPool(ndkAdapter(instance));

      // update account's metadata
      if (db.account) {
        const user = instance.getUser({ pubkey: db.account.pubkey });
        db.account.contacts = [...(await user.follows())].map((user) => user.pubkey);
        db.account.relayList = await user.relayList();

        // prefetch data
        await queryClient.prefetchInfiniteQuery({
          queryKey: ['newsfeed'],
          initialPageParam: 0,
          queryFn: async ({
            signal,
            pageParam,
          }: {
            signal: AbortSignal;
            pageParam: number;
          }) => {
            const rootIds = new Set();
            const dedupQueue = new Set();

            const events = await _fetcher.fetchLatestEvents(
              explicitRelayUrls,
              {
                kinds: [NDKKind.Text, NDKKind.Repost],
                authors: db.account.contacts,
              },
              FETCH_LIMIT,
              { asOf: pageParam === 0 ? undefined : pageParam, abortSignal: signal }
            );

            const ndkEvents = events.map((event) => {
              return new NDKEvent(ndk, event);
            });

            ndkEvents.forEach((event) => {
              const tags = event.tags.filter((el) => el[0] === 'e');
              if (tags && tags.length > 0) {
                const rootId = tags.filter((el) => el[3] === 'root')[1] ?? tags[0][1];
                if (rootIds.has(rootId)) return dedupQueue.add(event.id);
                rootIds.add(rootId);
              }
            });

            return ndkEvents
              .filter((event) => !dedupQueue.has(event.id))
              .sort((a, b) => b.created_at - a.created_at);
          },
        });

        await queryClient.prefetchInfiniteQuery({
          queryKey: ['notification'],
          initialPageParam: 0,
          queryFn: async ({
            signal,
            pageParam,
          }: {
            signal: AbortSignal;
            pageParam: number;
          }) => {
            const events = await _fetcher.fetchLatestEvents(
              explicitRelayUrls,
              {
                kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
                '#p': [db.account.pubkey],
              },
              FETCH_LIMIT,
              { asOf: pageParam === 0 ? undefined : pageParam, abortSignal: signal }
            );

            const ndkEvents = events.map((event) => {
              return new NDKEvent(ndk, event);
            });

            return ndkEvents.sort((a, b) => b.created_at - a.created_at);
          },
        });
      }

      setNDK(instance);
      setFetcher(_fetcher);
      setRelayUrls(explicitRelayUrls);
    } catch (e) {
      const yes = await ask(
        `Something wrong, Lume is not working as expected, do you want to relaunch app?`,
        {
          title: 'Lume',
          type: 'error',
          okLabel: 'Yes',
        }
      );
      if (yes) relaunch();
    }
  }

  useEffect(() => {
    if (!ndk) initNDK();
  }, []);

  return {
    ndk,
    fetcher,
    relayUrls,
  };
};
