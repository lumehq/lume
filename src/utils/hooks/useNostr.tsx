import { NDKUser } from '@nostr-dev-kit/ndk';
import { LRUCache } from 'lru-cache';
import { NostrEvent } from 'nostr-fetch';
import { nip19 } from 'nostr-tools';

import { useNDK } from '@libs/ndk/provider';
import {
  countTotalNotes,
  createChat,
  createNote,
  getActiveAccount,
  getLastLogin,
  updateAccount,
} from '@libs/storage';

import { nHoursAgo } from '@utils/date';

export function useNostr() {
  const { ndk, relayUrls, fetcher } = useNDK();

  async function fetchNetwork(prevFollow?: string[]) {
    const account = await getActiveAccount();
    const follows = new Set<string>(prevFollow || []);
    const lruNetwork = new LRUCache<string, string, void>({ max: 300 });

    let network: string[];

    // fetch user's follows
    if (!prevFollow) {
      const user = ndk.getUser({ hexpubkey: account.pubkey });
      const list = await user.follows();
      list.forEach((item: NDKUser) => {
        follows.add(nip19.decode(item.npub).data as string);
      });
    }

    // fetch network
    if (!account.network) {
      console.log('fetching network...', follows.size);
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

  const fetchNotes = async (prevFollow?: string[]) => {
    try {
      const network = (await fetchNetwork(prevFollow)) as string[];

      const totalNotes = await countTotalNotes();
      const lastLogin = await getLastLogin();

      if (network.length > 0) {
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

      return true;
    } catch (e) {
      console.log('error: ', e);
    }
  };

  const fetchChats = async () => {
    try {
      const account = await getActiveAccount();
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

      return true;
    } catch (e) {
      console.log('error: ', e);
    }
  };

  return { fetchNotes, fetchChats };
}
