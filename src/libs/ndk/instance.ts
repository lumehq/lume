// inspire by: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { fetch } from '@tauri-apps/plugin-http';
import { useEffect, useState } from 'react';

import TauriAdapter from '@libs/ndk/cache';
import { getExplicitRelayUrls } from '@libs/storage';
import { useStorage } from '@libs/storage/provider';

import { FULL_RELAYS } from '@stores/constants';

export const NDKInstance = () => {
  const { db } = useStorage();

  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [relayUrls, setRelayUrls] = useState<string[]>([]);

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

    const cacheAdapter = new TauriAdapter(db);
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
  }, []);

  return {
    ndk,
    relayUrls,
  };
};
