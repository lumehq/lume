import LumeIcon from '@lume/shared/icons/lume';
import { RelayContext } from '@lume/shared/relaysProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { dateToUnix, hoursAgo } from '@lume/utils/getDate';
import {
  addToBlacklist,
  countTotalNotes,
  createChat,
  createNote,
  getActiveAccount,
  getLastLogin,
  updateLastLogin,
} from '@lume/utils/storage';
import { getParentID } from '@lume/utils/transform';

import { useContext, useEffect, useRef } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

export function Page() {
  const pool: any = useContext(RelayContext);
  const now = useRef(new Date());

  useEffect(() => {
    let unsubscribe: () => void;
    let timeout: any;

    const fetchInitalData = async (account: { pubkey: string; id: number }, tags: string) => {
      const lastLogin = await getLastLogin();
      const notes = await countTotalNotes();

      const follows = JSON.parse(tags);
      const query = [];

      let since: number;

      if (notes.total === 0) {
        since = dateToUnix(hoursAgo(24, now.current));
      } else {
        if (parseInt(lastLogin) > 0) {
          since = parseInt(lastLogin);
        } else {
          since = dateToUnix(hoursAgo(24, now.current));
        }
      }

      // kind 1 (notes) query
      query.push({
        kinds: [1, 6],
        authors: follows,
        since: since,
        until: dateToUnix(now.current),
      });

      // kind 4 (chats) query
      query.push({
        kinds: [4],
        '#p': [account.pubkey],
        since: 0,
        until: dateToUnix(now.current),
      });

      // kind 43, 43 (mute user, hide message) query
      query.push({
        authors: [account.pubkey],
        kinds: [43, 44],
        since: 0,
        until: dateToUnix(now.current),
      });

      // subscribe relays
      unsubscribe = pool.subscribe(
        query,
        READONLY_RELAYS,
        (event: { kind: number; tags: string[]; id: string; pubkey: string; content: string; created_at: number }) => {
          switch (event.kind) {
            // short text note
            case 1:
              const parentID = getParentID(event.tags, event.id);
              // insert event to local database
              createNote(
                event.id,
                account.id,
                event.pubkey,
                event.kind,
                event.tags,
                event.content,
                event.created_at,
                parentID
              );
              break;
            // chat
            case 4:
              if (event.pubkey !== account.pubkey) {
                createChat(account.id, event.pubkey, event.created_at);
              }
              break;
            // repost
            case 6:
              createNote(
                event.id,
                account.id,
                event.pubkey,
                event.kind,
                event.tags,
                event.content,
                event.created_at,
                event.id
              );
              break;
            // hide message (channel only)
            case 43:
              if (event.tags[0][0] === 'e') {
                addToBlacklist(account.id, event.tags[0][1], 43, 1);
              }
            // mute user (channel only)
            case 44:
              if (event.tags[0][0] === 'p') {
                addToBlacklist(account.id, event.tags[0][1], 44, 1);
              }
            default:
              break;
          }
        },
        undefined,
        () => {
          updateLastLogin(dateToUnix(now.current));
          timeout = setTimeout(() => {
            navigate('/newsfeed/following', { overwriteLastHistoryEntry: true });
          }, 5000);
        }
      );
    };

    getActiveAccount()
      .then((res: any) => {
        if (res) {
          fetchInitalData(res, res.follows);
        } else {
          navigate('/onboarding', { overwriteLastHistoryEntry: true });
        }
      })
      .catch(console.error);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearTimeout(timeout);
    };
  }, [pool]);

  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="relative h-full overflow-hidden">
        {/* dragging area */}
        <div data-tauri-drag-region className="absolute left-0 top-0 z-20 h-16 w-full bg-transparent" />
        {/* end dragging area */}
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LumeIcon className="h-16 w-16 text-black dark:text-white" />
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
