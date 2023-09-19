// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { message } from '@tauri-apps/api/dialog';
import { fetch } from '@tauri-apps/api/http';
import { useEffect, useMemo, useState } from 'react';

import TauriAdapter from '@libs/ndk/cache';
import { useStorage } from '@libs/storage/provider';

export const NDKInstance = () => {
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

  const { db } = useStorage();
  const cacheAdapter = useMemo(() => new TauriAdapter(), [ndk]);

  // TODO: fully support NIP-11
  async function getExplicitRelays() {
    try {
      // get relays
      const relays = await db.getExplicitRelayUrls();
      const requests = relays.map((relay) => {
        const url = new URL(relay);
        return fetch(`https://${url.hostname + url.pathname}`, {
          method: 'GET',
          timeout: 10,
          headers: {
            Accept: 'application/nostr+json',
          },
        });
      });

      const responses = await Promise.all(requests);
      const successes = responses.filter((res) => res.ok);

      const verifiedRelays: string[] = successes.map((res) => {
        // TODO: support payment
        // @ts-expect-error, not have type yet
        if (!res.data.limitation?.payment_required) {
          const url = new URL(res.url);
          if (url.protocol === 'http:') return `ws://${url.hostname + url.pathname}`;
          if (url.protocol === 'https:') return `wss://${url.hostname + url.pathname}`;
        }
      });

      // return all validated relays
      return verifiedRelays;
    } catch (e) {
      console.error(e);
    }
  }

  async function initNDK() {
    const explicitRelayUrls = await getExplicitRelays();
    const instance = new NDK({
      explicitRelayUrls,
      cacheAdapter,
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

    return () => {
      cacheAdapter.saveCache();
    };
  }, []);

  return {
    ndk,
    relayUrls,
  };
};
