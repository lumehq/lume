import NDK, { NDKNip46Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { message } from '@tauri-apps/plugin-dialog';
import { fetch } from '@tauri-apps/plugin-http';
import { NostrFetcher } from 'nostr-fetch';
import { useEffect, useMemo, useState } from 'react';

import NDKCacheAdapterTauri from '@libs/ndk/cache';
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
        try {
          const url = new URL(relay);
          const res = await fetch(`https://${url.hostname}`, {
            method: 'GET',
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

  async function getSigner(instance: NDK) {
    if (!db.account) return null;

    const localSignerPrivkey = await db.secureLoad(db.account.pubkey + '-bunker');
    const userPrivkey = await db.secureLoad(db.account.pubkey);

    // NIP-46 Signer
    if (localSignerPrivkey) {
      const localSigner = new NDKPrivateKeySigner(localSignerPrivkey);
      const remoteSigner = new NDKNip46Signer(instance, db.account.id, localSigner);
      await remoteSigner.blockUntilReady();

      return remoteSigner;
    }

    // Privkey Signer
    if (userPrivkey) {
      return new NDKPrivateKeySigner(userPrivkey);
    }
  }

  async function initNDK() {
    const outboxSetting = await db.getSettingValue('outbox');
    const explicitRelayUrls = await getExplicitRelays();

    const tauriAdapter = new NDKCacheAdapterTauri(db);
    const instance = new NDK({
      explicitRelayUrls,
      cacheAdapter: tauriAdapter,
      outboxRelayUrls: ['wss://purplepag.es'],
      enableOutboxModel: outboxSetting === '1',
    });

    try {
      // connect
      await instance.connect(2000);

      // add signer
      const signer = await getSigner(instance);
      instance.signer = signer;

      // update account's metadata
      if (db.account) {
        const circleSetting = await db.getSettingValue('circles');

        const user = instance.getUser({ pubkey: db.account.pubkey });
        const follows = await user.follows();
        const relayList = await user.relayList();

        const followsAsArr = [];
        follows.forEach((user) => {
          followsAsArr.push(user.pubkey);
        });

        // update user's follows
        await db.updateAccount('follows', JSON.stringify(followsAsArr));
        if (circleSetting !== '1')
          await db.updateAccount('circles', JSON.stringify(followsAsArr));

        // update user's relay list
        if (relayList) {
          for (const relay of relayList.relays) {
            await db.createRelay(relay);
          }
        }
      }
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
