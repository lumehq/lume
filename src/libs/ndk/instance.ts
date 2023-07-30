// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { NostrFetcher, normalizeRelayUrlSet } from 'nostr-fetch';
import { useEffect, useState } from 'react';

import TauriAdapter from '@libs/ndk/cache';
import { getSetting } from '@libs/storage';

const setting = await getSetting('relays');
const relays = normalizeRelayUrlSet(JSON.parse(setting));

export const NDKInstance = () => {
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>(relays);
  const [fetcher, setFetcher] = useState<NostrFetcher>(undefined);

  useEffect(() => {
    loadNdk(relays);
  }, []);

  async function loadNdk(explicitRelayUrls: string[]) {
    const cacheAdapter = new TauriAdapter();
    const ndkInstance = new NDK({ explicitRelayUrls, cacheAdapter });

    try {
      await ndkInstance.connect();
    } catch (error) {
      console.error('ERROR loading NDK NDKInstance', error);
    }

    setNDK(ndkInstance);
    setRelayUrls(explicitRelayUrls);
    setFetcher(NostrFetcher.withCustomPool(ndkAdapter(ndkInstance)));
  }

  return {
    ndk,
    relayUrls,
    fetcher,
    loadNdk,
  };
};
