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
import { NostrFetcher, normalizeRelayUrlSet } from 'nostr-fetch';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import NDKCacheAdapterTauri from '@libs/ndk/cache';
import { useStorage } from '@libs/storage/provider';

import { FETCH_LIMIT } from '@utils/constants';

export const NDKInstance = () => {
  const { db } = useStorage();
  const queryClient = useQueryClient();

  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [fetcher, setFetcher] = useState<NostrFetcher | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

  async function getSigner(nsecbunker?: boolean) {
    if (!db.account) return;

    try {
      // NIP-46 Signer
      if (nsecbunker) {
        const localSignerPrivkey = await db.secureLoad(`${db.account.pubkey}-nsecbunker`);
        if (!localSignerPrivkey) return null;

        const localSigner = new NDKPrivateKeySigner(localSignerPrivkey);
        const bunker = new NDK({
          explicitRelayUrls: ['wss://relay.nsecbunker.com', 'wss://nostr.vulpem.com'],
        });
        bunker.connect();

        const remoteSigner = new NDKNip46Signer(bunker, db.account.id, localSigner);
        await remoteSigner.blockUntilReady();

        return remoteSigner;
      }

      // Privkey Signer
      const userPrivkey = await db.secureLoad(db.account.pubkey);
      if (!userPrivkey) return null;
      return new NDKPrivateKeySigner(userPrivkey);
    } catch (e) {
      console.log(e);
      if (e === 'Token already redeemed') {
        toast.info(
          'nsecbunker token already redeemed. You need to re-login with another token.'
        );

        await db.secureRemove(`${db.account.pubkey}-nsecbunker`);
        await db.accountLogout();
      }

      return null;
    }
  }

  async function initNDK() {
    const outboxSetting = await db.getSettingValue('outbox');
    const bunkerSetting = await db.getSettingValue('nsecbunker');

    const bunker = !!parseInt(bunkerSetting);
    const outbox = !!parseInt(outboxSetting);

    const explicitRelayUrls = normalizeRelayUrlSet([
      'wss://relay.damus.io',
      'wss://relay.nostr.band',
      'wss://nos.lol',
      'wss://nostr.mutinywallet.com',
    ]);

    // #TODO: user should config outbox relays
    const outboxRelayUrls = normalizeRelayUrlSet(['wss://purplepag.es']);

    // #TODO: user should config blacklist relays
    const blacklistRelayUrls = normalizeRelayUrlSet(['wss://brb.io']);

    try {
      const tauriAdapter = new NDKCacheAdapterTauri(db);
      const instance = new NDK({
        explicitRelayUrls,
        outboxRelayUrls,
        blacklistRelayUrls,
        enableOutboxModel: outbox,
        autoConnectUserRelays: true,
        autoFetchUserMutelist: true,
        cacheAdapter: tauriAdapter,
        // clientName: 'Lume',
        // clientNip89: '',
      });

      // add signer if exist
      const signer = await getSigner(bunker);
      if (signer) instance.signer = signer;

      // connect
      await instance.connect();
      const _fetcher = NostrFetcher.withCustomPool(ndkAdapter(instance));

      // update account's metadata
      if (db.account) {
        const user = instance.getUser({ pubkey: db.account.pubkey });
        instance.activeUser = user;

        const contacts = await user.follows(undefined /* outbox */);
        db.account.contacts = [...contacts].map((user) => user.pubkey);

        // prefetch newsfeed
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

        // prefetch notification
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
      console.error(e);
      const yes = await ask(e, {
        title: 'Lume',
        type: 'error',
        okLabel: 'Yes',
      });
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
