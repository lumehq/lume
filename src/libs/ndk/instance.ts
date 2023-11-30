import NDK, { NDKNip46Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { ask } from '@tauri-apps/plugin-dialog';
import { fetch } from '@tauri-apps/plugin-http';
import { relaunch } from '@tauri-apps/plugin-process';
import { NostrFetcher } from 'nostr-fetch';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function getExplicitRelays() {
    try {
      // get relays
      const relays = await db.getExplicitRelayUrls();
      const onlineRelays = new Set(relays);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      for (const relay of relays) {
        try {
          const url = new URL(relay);
          const res = await fetch(`https://${url.hostname}`, {
            method: 'GET',
            headers: {
              Accept: 'application/nostr+json',
            },
            signal: controller.signal,
          });

          if (!res.ok) {
            toast.warning(`${relay} is not working, skipping...`);
            onlineRelays.delete(relay);
          }

          toast.success(`Connected to ${relay}`);
        } catch {
          toast.warning(`${relay} is not working, skipping...`);
          onlineRelays.delete(relay);
        } finally {
          clearTimeout(timeoutId);
        }
      }

      // return all online relays
      return [...onlineRelays];
    } catch (e) {
      console.error(e);
    }
  }

  async function getSigner(nsecbunker?: boolean) {
    if (!db.account) return;

    // NIP-46 Signer
    if (nsecbunker) {
      const localSignerPrivkey = await db.secureLoad(db.account.pubkey + '-nsecbunker');
      if (!localSignerPrivkey) return null;
      const localSigner = new NDKPrivateKeySigner(localSignerPrivkey);
      // await remoteSigner.blockUntilReady();
      return new NDKNip46Signer(ndk, db.account.id, localSigner);
    }

    // Private Key Signer
    const userPrivkey = await db.secureLoad(db.account.pubkey);
    if (!userPrivkey) return null;
    return new NDKPrivateKeySigner(userPrivkey);
  }

  async function initNDK() {
    try {
      const outboxSetting = await db.getSettingValue('outbox');
      const bunkerSetting = await db.getSettingValue('nsecbunker');

      const bunker = !!parseInt(bunkerSetting);
      const outbox = !!parseInt(outboxSetting);

      const signer = await getSigner(bunker);
      const explicitRelayUrls = await db.getExplicitRelayUrls();

      const tauriAdapter = new NDKCacheAdapterTauri(db);
      const instance = new NDK({
        explicitRelayUrls,
        cacheAdapter: tauriAdapter,
        outboxRelayUrls: ['wss://purplepag.es'],
        enableOutboxModel: outbox,
      });

      // add signer if exist
      if (signer) instance.signer = signer;

      // connect
      await instance.connect();

      // update account's metadata
      if (db.account) {
        const user = instance.getUser({ pubkey: db.account.pubkey });
        if (user) {
          db.account.contacts = [...(await user.follows())].map((user) => user.pubkey);
          db.account.relayList = await user.relayList();
        }
      }

      setNDK(instance);
      setRelayUrls(explicitRelayUrls);
    } catch (e) {
      const yes = await ask(
        `Something wrong, Lume is not working as expected, do you want to relaunch app?`,
        {
          title: 'Lume',
          type: 'error',
          okLabel: 'Yes',
        }
      );
      if (yes) relaunch();
    }
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
