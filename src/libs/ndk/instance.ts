// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
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
    () => NostrFetcher.withCustomPool(ndkAdapter(ndk)),
    [ndk]
  );

  async function initNDK() {
    let explicitRelayUrls: string[];
    const explicitRelayUrlsFromDB = await getExplicitRelayUrls();

    if (explicitRelayUrlsFromDB) {
      explicitRelayUrls = explicitRelayUrlsFromDB;
    } else {
      explicitRelayUrls = FULL_RELAYS;
    }

    const instance = new NDK({ explicitRelayUrls, cacheAdapter });

    try {
      await instance.connect();
    } catch (error) {
      console.error('NDK instance init failed: ', error);
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
