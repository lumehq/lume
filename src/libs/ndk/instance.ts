// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { message } from '@tauri-apps/api/dialog';
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
  async function getExplicitRelays() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort('timeout'), 10000);

      // get relays
      const relays = (await db.getExplicitRelayUrls()) ?? FULL_RELAYS;

      const requests = relays.map((relay) => {
        const url = new URL(relay);

        return fetch(`https://${url.hostname + url.pathname}`, {
          headers: { Accept: 'application/nostr+json' },
          signal: controller.signal,
        });
      });

      const responses = await Promise.all(requests);
      const errors = responses.filter((response) => !response.ok);

      if (errors.length > 0) throw errors.map((response) => Error(response.statusText));

      const verifiedRelays: string[] = responses.map((res) => {
        const url = new URL(res.url);
        if (url.protocol === 'http:') return `ws://${url.hostname + url.pathname}`;
        if (url.protocol === 'https:') return `wss://${url.hostname + url.pathname}`;
      });

      // clear timeout
      clearTimeout(timeoutId);

      // return all validate relays
      return verifiedRelays;
    } catch (e) {
      await message(e, { title: 'Cannot connect to relays', type: 'error' });
    }
  }

  async function initNDK() {
    const explicitRelayUrls = await getExplicitRelays();
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
