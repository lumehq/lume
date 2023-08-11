import { NDKEvent, NDKKind, NDKPrivateKeySigner, NDKUser } from '@nostr-dev-kit/ndk';
import destr from 'destr';
import { LRUCache } from 'lru-cache';
import { NostrEvent } from 'nostr-fetch';
import { nip19 } from 'nostr-tools';

import { useNDK } from '@libs/ndk/provider';
import {
  countTotalNotes,
  createChat,
  createNote,
  getLastLogin,
  updateAccount,
} from '@libs/storage';

import { useStronghold } from '@stores/stronghold';

import { nHoursAgo } from '@utils/date';
import { useAccount } from '@utils/hooks/useAccount';

export function useNostr() {
  const privkey = useStronghold((state) => state.privkey);

  const { ndk, relayUrls, fetcher } = useNDK();
  const { account } = useAccount();

  async function fetchNetwork(prevFollow?: string[]) {
    const follows = new Set<string>(prevFollow || []);
    const lruNetwork = new LRUCache<string, string, void>({ max: 300 });

    let network: string[];

    // fetch user's follows
    if (!prevFollow) {
      console.log("fetching user's follow...");
      const user = ndk.getUser({ hexpubkey: account.pubkey });
      const list = await user.follows();
      list.forEach((item: NDKUser) => {
        follows.add(nip19.decode(item.npub).data as string);
      });
    }

    // fetch network
    if (!account.network) {
      console.log("fetching user's network...");
      const events = await fetcher.fetchAllEvents(
        relayUrls,
        { kinds: [3], authors: [...follows] },
        { since: 0 },
        { skipVerification: true }
      );

      events.forEach((event: NostrEvent) => {
        event.tags.forEach((tag) => {
          if (tag[0] === 'p') lruNetwork.set(tag[1], tag[1]);
        });
      });

      network = [...lruNetwork.values()] as string[];
    } else {
      network = account.network;
    }

    // update user in db
    await updateAccount('follows', [...follows]);
    await updateAccount('network', network);

    return [...new Set([...follows, ...network])];
  }

  async function fetchNotes(prevFollow?: string[]) {
    try {
      if (!ndk) return { status: 'failed', message: 'NDK instance not found' };

      const network = await fetchNetwork(prevFollow);
      const totalNotes = await countTotalNotes();
      const lastLogin = await getLastLogin();

      if (network.length > 0) {
        console.log('fetching notes...');

        let since: number;
        if (totalNotes === 0 || lastLogin === 0) {
          since = nHoursAgo(24);
        } else {
          since = lastLogin;
        }

        const events = await fetcher.fetchAllEvents(
          relayUrls,
          { kinds: [1], authors: network },
          { since: since },
          { skipVerification: true }
        );

        for (const event of events) {
          await createNote(
            event.id,
            event.pubkey,
            event.kind,
            event.tags,
            event.content,
            event.created_at
          );
        }
      }

      return { status: 'ok' };
    } catch (e) {
      console.error('failed fetch notes, error: ', e);
      return { status: 'failed', message: e };
    }
  }

  async function fetchChats() {
    try {
      if (!ndk) return { status: 'failed', message: 'NDK instance not found' };

      const lastLogin = await getLastLogin();
      const incomingMessages = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [4],
          '#p': [account.pubkey],
        },
        { since: lastLogin },
        { skipVerification: true }
      );

      for (const event of incomingMessages) {
        const receiverPubkey = event.tags.find((t) => t[0] === 'p')[1] || account.pubkey;
        await createChat(
          event.id,
          receiverPubkey,
          event.pubkey,
          event.content,
          event.tags,
          event.created_at
        );
      }

      return { status: 'ok' };
    } catch (e) {
      console.error('failed fetch incoming messages, error: ', e);
      return { status: 'failed', message: e };
    }
  }

  const publish = async ({
    content,
    kind,
    tags,
  }: {
    content: string;
    kind: NDKKind | number;
    tags: string[][];
  }): Promise<NDKEvent> => {
    if (!privkey) throw new Error('Private key not found');

    const event = new NDKEvent(ndk);
    const signer = new NDKPrivateKeySigner(privkey);

    event.content = content;
    event.kind = kind;
    event.created_at = Math.floor(Date.now() / 1000);
    event.pubkey = account.pubkey;
    event.tags = tags;

    await event.sign(signer);
    await event.publish();

    return event;
  };

  const createZap = async (event: NostrEvent, amount: number, message?: string) => {
    // @ts-expect-error, LumeEvent to NostrEvent
    event.id = event.event_id;

    // @ts-expect-error, LumeEvent to NostrEvent
    if (typeof event.content !== 'string') event.content = event.content.original;

    if (typeof event.tags === 'string') event.tags = destr(event.tags);

    if (!privkey) throw new Error('Private key not found');

    if (!ndk.signer) {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
    }

    const ndkEvent = new NDKEvent(ndk, event);
    const res = await ndkEvent.zap(amount, message ?? 'zap from lume');

    return res;
  };

  return { fetchNotes, fetchChats, publish, createZap };
}
