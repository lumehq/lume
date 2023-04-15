'use client';

import { RelayContext } from '@components/relaysProvider';

import { dateToUnix, hoursAgo } from '@utils/getDate';
import { getParentID, pubkeyArray } from '@utils/transform';

import LumeSymbol from '@assets/icons/Lume';

import useLocalStorage, { writeStorage } from '@rehooks/local-storage';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef } from 'react';

export default function Page() {
  const [pool, relays]: any = useContext(RelayContext);
  const router = useRouter();

  const [lastLogin] = useLocalStorage('lastLogin', new Date());

  const now = useRef(new Date());
  const eose = useRef(0);
  const unsubscribe = useRef(null);

  const fetchActiveAccount = useCallback(async () => {
    const { getAccounts } = await import('@utils/bindings');
    return await getAccounts();
  }, []);

  const fetchPlebsByAccount = useCallback(async (id: number, kind: number) => {
    const { getPlebs } = await import('@utils/bindings');
    return await getPlebs({ account_id: id, kind: kind });
  }, []);

  const totalNotes = useCallback(async () => {
    const { countTotalNotes } = await import('@utils/commands');
    return countTotalNotes();
  }, []);

  const totalChannels = useCallback(async () => {
    const { countTotalChannels } = await import('@utils/commands');
    return countTotalChannels();
  }, []);

  const totalChats = useCallback(async () => {
    const { countTotalChats } = await import('@utils/commands');
    return countTotalChats();
  }, []);

  const fetchData = useCallback(
    async (account, follows) => {
      const { createNote } = await import('@utils/bindings');
      const { createChat } = await import('@utils/bindings');
      const { createChannel } = await import('@utils/bindings');

      const notes = await totalNotes();
      const channels = await totalChannels();
      const chats = await totalChats();

      const query = [];
      let since: number;

      // kind 1 (notes) query
      if (notes === 0) {
        since = dateToUnix(hoursAgo(24, now.current));
      } else {
        since = dateToUnix(new Date(lastLogin));
      }
      query.push({
        kinds: [1],
        authors: follows,
        since: since,
        until: dateToUnix(now.current),
      });
      // kind 4 (chats) query
      if (chats === 0) {
        query.push({
          kinds: [4],
          '#p': [account.pubkey],
          since: 0,
          until: dateToUnix(now.current),
        });
      }
      // kind 40 (channels) query
      if (channels === 0) {
        query.push({
          kinds: [40],
          since: 0,
          until: dateToUnix(now.current),
        });
      }
      // subscribe relays
      unsubscribe.current = pool.subscribe(
        query,
        relays,
        (event) => {
          if (event.kind === 1) {
            const parentID = getParentID(event.tags, event.id);
            // insert event to local database
            createNote({
              event_id: event.id,
              pubkey: event.pubkey,
              kind: event.kind,
              tags: JSON.stringify(event.tags),
              content: event.content,
              parent_id: parentID,
              parent_comment_id: '',
              created_at: event.created_at,
              account_id: account.id,
            }).catch(console.error);
          } else if (event.kind === 4) {
            if (event.pubkey !== account.pubkey) {
              createChat({
                pubkey: event.pubkey,
                created_at: event.created_at,
                account_id: account.id,
              }).catch(console.error);
            }
          } else if (event.kind === 40) {
            createChannel({ event_id: event.id, content: event.content, account_id: account.id }).catch(console.error);
          } else {
            console.error;
          }
        },
        undefined,
        () => {
          if (eose.current > relays.length - 7) {
            router.replace('/newsfeed/following');
          } else {
            eose.current += 1;
          }
        }
      );
    },
    [router, pool, relays, lastLogin, totalChannels, totalChats, totalNotes]
  );

  useEffect(() => {
    let account;
    let follows;

    fetchActiveAccount()
      .then((res: any) => {
        if (res.length > 0) {
          account = res[0];
          // update local storage
          writeStorage('activeAccount', res[0]);
          // fetch plebs, kind 0 = following
          fetchPlebsByAccount(res[0].id, 0).then((res) => {
            follows = pubkeyArray(res);
            writeStorage('activeAccountFollows', res);
            // fetch data
            fetchData(account, follows);
          });
        } else {
          router.replace('/onboarding');
        }
      })
      .catch(console.error);

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [fetchActiveAccount, fetchPlebsByAccount, totalNotes, fetchData, router]);

  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="relative h-full overflow-hidden">
        {/* dragging area */}
        <div data-tauri-drag-region className="absolute left-0 top-0 z-20 h-16 w-full bg-transparent" />
        {/* end dragging area */}
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LumeSymbol className="h-16 w-16 text-black dark:text-white" />
            <div className="text-center">
              <h3 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                Here&apos;s an interesting fact:
              </h3>
              <p className="font-medium text-zinc-300 dark:text-zinc-600">
                Bitcoin and Nostr can be used by anyone, and no one can stop you!
              </p>
            </div>
          </div>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 transform">
            <svg
              className="h-5 w-5 animate-spin text-black dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
