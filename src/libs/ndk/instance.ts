// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { useEffect, useMemo, useState } from 'react';

import TauriAdapter from '@libs/ndk/cache';
import { useStorage } from '@libs/storage/provider';

import { FULL_RELAYS } from '@stores/constants';

export const NDKInstance = () => {
  const { db } = useStorage();

  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

  const cacheAdapter = useMemo(() => new TauriAdapter(), [ndk]);

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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort('timeout'), 5000);
        const res = await fetch(url, {
          headers: { Accept: 'application/nostr+json' },
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          console.log('relay information: ', data);

          verifiedRelays.push(relay);
          clearTimeout(timeoutId);
        } else {
          console.log('relay not working: ', res);
        }
      } catch (e) {
        console.log('fetch error', e);
      }
    }

    return verifiedRelays;
  }

  async function initNDK() {
    let explicitRelayUrls: string[];
    const explicitRelayUrlsFromDB = await db.getExplicitRelayUrls();
    console.log('relays in db: ', explicitRelayUrlsFromDB);

    if (explicitRelayUrlsFromDB) {
      explicitRelayUrls = await verifyRelays(explicitRelayUrlsFromDB);
    } else {
      explicitRelayUrls = await verifyRelays(FULL_RELAYS);
    }

    console.log('ndk cache adapter: ', cacheAdapter);
    const instance = new NDK({ explicitRelayUrls, cacheAdapter });

    try {
      await instance.connect(10000);
    } catch (error) {
      throw new Error('NDK instance init failed: ', error);
    }

    setNDK(instance);
    setRelayUrls(explicitRelayUrls);
  }

  useEffect(() => {
    if (!ndk) initNDK();

    return () => {
      cacheAdapter.saveCache();
    };
  }, []);

  return {
    ndk,
    relayUrls,
  };
};
