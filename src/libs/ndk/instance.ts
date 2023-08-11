// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { fetch } from '@tauri-apps/plugin-http';
import { NostrFetcher } from 'nostr-fetch';
import { useEffect, useMemo, useState } from 'react';

import TauriAdapter from '@libs/ndk/cache';
import { getExplicitRelayUrls } from '@libs/storage';

import { FULL_RELAYS } from '@stores/constants';

export const NDKInstance = () => {
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

  const cacheAdapter = useMemo(() => new TauriAdapter(), []);
  const fetcher = useMemo<NostrFetcher>(
    () => (ndk ? NostrFetcher.withCustomPool(ndkAdapter(ndk)) : undefined),
    [ndk]
  );

  // TODO: fully support NIP-11
  async function verifyRelays(relays: string[]) {
    const verifiedRelays: string[] = [];

    for (const relay of relays) {
      let url: string;

      if (relay.startsWith('ws')) {
        url = relay.replace('ws', 'http');
      }

      if (relay.startsWith('wss')) {
        url = relay.replace('wss', 'https');
      }

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/nostr+json' },
        });

        if (res.ok) {
          const data = await res.json();
          console.log('relay information: ', data);
          verifiedRelays.push(relay);
        }
      } catch (e) {
        console.log('fetch error', e);
      }
    }

    return verifiedRelays;
  }

  async function initNDK() {
    let explicitRelayUrls: string[];
    const explicitRelayUrlsFromDB = await getExplicitRelayUrls();

    if (explicitRelayUrlsFromDB) {
      explicitRelayUrls = await verifyRelays(explicitRelayUrlsFromDB);
    } else {
      explicitRelayUrls = await verifyRelays(FULL_RELAYS);
    }

    const instance = new NDK({ explicitRelayUrls, cacheAdapter });

    try {
      await instance.connect();
    } catch (error) {
      throw new Error('NDK instance init failed: ', error);
    }

    setNDK(instance);
    setRelayUrls(explicitRelayUrls);
  }

  useEffect(() => {
    if (!ndk) initNDK();

    return () => {
      cacheAdapter.save();
    };
  }, []);

  return {
    ndk,
    relayUrls,
    fetcher,
  };
};
