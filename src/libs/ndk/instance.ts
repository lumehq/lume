// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { NostrFetcher } from 'nostr-fetch';
import { useEffect, useMemo, useState } from 'react';

import TauriAdapter from '@libs/ndk/cache';
import { getExplicitRelayUrls } from '@libs/storage';

import { FULL_RELAYS } from '@stores/constants';

export const NDKInstance = () => {
  const cacheAdapter = useMemo(() => new TauriAdapter(), []);

  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);
  const [fetcher, setFetcher] = useState<NostrFetcher>(undefined);

  useEffect(() => {
    if (!ndk) loadNdk();

    return () => {
      cacheAdapter.save();
    };
  }, []);

  async function loadNdk() {
    let explicitRelayUrls: string[];
    const explicitRelayUrlsFromDB = await getExplicitRelayUrls();

    if (explicitRelayUrlsFromDB) {
      explicitRelayUrls = explicitRelayUrlsFromDB;
    } else {
      explicitRelayUrls = FULL_RELAYS;
    }

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
