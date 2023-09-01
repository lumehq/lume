// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { message } from '@tauri-apps/plugin-dialog';
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
    try {
      const urls: string[] = relays.map((relay) => {
        if (relay.startsWith('ws')) {
          return relay.replace('ws', 'http');
        }
        if (relay.startsWith('wss')) {
          return relay.replace('wss', 'https');
        }
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort('timeout'), 10000);

      const requests = urls.map((url) =>
        fetch(url, {
          headers: { Accept: 'application/nostr+json' },
          signal: controller.signal,
        })
      );
      const responses = await Promise.all(requests);
      const errors = responses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const verifiedRelays: string[] = responses.map((res) => {
        if (res.url.startsWith('http')) {
          return res.url.replace('htto', 'ws');
        }
        if (res.url.startsWith('https')) {
          return res.url.replace('https', 'wss');
        }
      });

      // clear timeout
      clearTimeout(timeoutId);

      // return all validate relays
      return verifiedRelays;
    } catch (e) {
      console.error('verify relay failed with error: ', e);
    }
  }

  async function initNDK() {
    let explicitRelayUrls: string[];
    const explicitRelayUrlsFromDB = await db.getExplicitRelayUrls();

    console.log('relays in db: ', explicitRelayUrlsFromDB);
    console.log('ndk cache adapter: ', cacheAdapter);

    if (explicitRelayUrlsFromDB) {
      explicitRelayUrls = await verifyRelays(explicitRelayUrlsFromDB);
    } else {
      explicitRelayUrls = await verifyRelays(FULL_RELAYS);
    }

    if (explicitRelayUrls.length < 1) {
      await message('Something is wrong. No relays have been found.', {
        title: 'Lume',
        type: 'error',
      });
    }

    const instance = new NDK({ explicitRelayUrls, cacheAdapter });
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

    return () => {
      cacheAdapter.saveCache();
    };
  }, []);

  return {
    ndk,
    relayUrls,
  };
};
