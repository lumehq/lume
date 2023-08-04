import { NDKUser } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import {
  countTotalNotes,
  createChat,
  createNote,
  getLastLogin,
  updateAccount,
  updateLastLogin,
} from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

import { nHoursAgo } from '@utils/date';
import { useAccount } from '@utils/hooks/useAccount';

const totalNotes = await countTotalNotes();
const lastLogin = await getLastLogin();

export function Root() {
  const navigate = useNavigate();

  const { ndk, relayUrls, fetcher } = useNDK();
  const { status, account } = useAccount();

  async function fetchNetwork() {
    const network = new Set<string>();

    // fetch user's follows
    const user = ndk.getUser({ hexpubkey: account.pubkey });
    const follows = await user.follows();
    follows.forEach((follow: NDKUser) => {
      network.add(nip19.decode(follow.npub).data as string);
    });

    // update user's follows in db
    await updateAccount('follows', [...network]);

    // fetch network
    for (const item of network) {
      const user = ndk.getUser({ hexpubkey: item });
      const follows = await user.follows();
      follows.forEach((follow: NDKUser) => {
        network.add(nip19.decode(follow.npub).data as string);
      });
    }

    // update user's network in db
    await updateAccount('network', [...network]);

    return [...network];
  }

  async function fetchNotes() {
    try {
      const network = await fetchNetwork();

      if (network.length > 0) {
        let since: number;
        if (totalNotes === 0 || lastLogin === 0) {
          since = nHoursAgo(48);
        } else {
          since = lastLogin;
        }

        const events = fetcher.allEventsIterator(
          relayUrls,
          { kinds: [1], authors: network },
          { since: since },
          { skipVerification: true }
        );
        for await (const event of events) {
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
  }

  async function fetchChats() {
    try {
      const sendMessages = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [4],
          authors: [account.pubkey],
        },
        { since: lastLogin }
      );

      const receiveMessages = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [4],
          '#p': [account.pubkey],
        },
        { since: lastLogin }
      );

      const events = [...sendMessages, ...receiveMessages];
      for (const event of events) {
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
  }

  useEffect(() => {
    async function prefetch() {
      const notes = await fetchNotes();
      const chats = await fetchChats();
      if (notes && chats) {
        const now = Math.floor(Date.now() / 1000);
        await updateLastLogin(now);
        navigate('/app/space', { replace: true });
      }
    }

    if (status === 'success' && account) {
      prefetch();
    }
  }, [status]);

  return (
    <div className="h-screen w-screen bg-black/90">
      <div className="flex h-screen w-full flex-col">
        <div data-tauri-drag-region className="h-11 shrink-0" />
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <LoaderIcon className="h-6 w-6 animate-spin text-white" />
            <div className="text-center">
              <h3 className="text-lg font-semibold leading-tight text-white">
                Prefetching data...
              </h3>
              <p className="text-white/50">
                This may take a few seconds, please don&apos;t close app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
