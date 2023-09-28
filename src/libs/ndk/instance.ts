import NDK from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { message } from '@tauri-apps/api/dialog';
import { fetch } from '@tauri-apps/api/http';
import { NostrFetcher } from 'nostr-fetch';
import { useEffect, useMemo, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

export const NDKInstance = () => {
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

  const { db } = useStorage();
  const fetcher = useMemo(
    () => (ndk ? NostrFetcher.withCustomPool(ndkAdapter(ndk)) : null),
    [ndk]
  );

  // TODO: fully support NIP-11
  async function getExplicitRelays() {
    try {
      // get relays
      const relays = await db.getExplicitRelayUrls();
      const onlineRelays = new Set(relays);

      for (const relay of relays) {
        const url = new URL(relay);
        try {
          const res = await fetch(`https://${url.hostname}`, {
            method: 'GET',
            timeout: { secs: 5, nanos: 0 },
            headers: {
              Accept: 'application/nostr+json',
            },
          });

          if (!res.ok) {
            console.info(`${relay} is not working, skipping...`);
            onlineRelays.delete(relay);
          }
        } catch {
          console.warn(`${relay} is not working, skipping...`);
          onlineRelays.delete(relay);
        }
      }

      // return all online relays
      return [...onlineRelays];
    } catch (e) {
      console.error(e);
    }
  }

  async function initNDK() {
    const explicitRelayUrls = await getExplicitRelays();
    const dexieAdapter = new NDKCacheAdapterDexie({ dbName: 'lume_ndkcache' });
    const instance = new NDK({
      explicitRelayUrls,
      cacheAdapter: dexieAdapter,
    });

    try {
      await instance.connect(10000);
    } catch (error) {
      await message(`NDK instance init failed: ${error}`, {
        title: 'Lume',
        type: 'error',
      });
    }

    setNDK(instance);
    setRelayUrls(explicitRelayUrls);
  }

  useEffect(() => {
    if (!ndk) initNDK();
  }, []);

  return {
    ndk,
    relayUrls,
    fetcher,
  };
};
