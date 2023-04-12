import BaseLayout from '@layouts/base';

import { RelayContext } from '@components/relaysProvider';

import { dateToUnix, hoursAgo } from '@utils/getDate';
import { getParentID, pubkeyArray } from '@utils/transform';

import LumeSymbol from '@assets/icons/Lume';

import { useLocalStorage } from '@rehooks/local-storage';
import { invoke } from '@tauri-apps/api/tauri';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Page() {
  const router = useRouter();
  const [pool, relays]: any = useContext(RelayContext);

  const now = useRef(new Date());
  const unsubscribe = useRef(null);

  const [eose, setEose] = useState(false);

  const [lastLogin] = useLocalStorage('lastLogin', '');
  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [follows] = useLocalStorage('activeAccountFollows', []);

  const fetchData = useCallback(
    async (since: Date) => {
      const { createNote } = await import('@utils/bindings');

      unsubscribe.current = pool.subscribe(
        [
          {
            kinds: [1],
            authors: pubkeyArray(follows),
            since: dateToUnix(since),
            until: dateToUnix(now.current),
          },
        ],
        relays,
        (event) => {
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
            account_id: activeAccount.id,
          }).catch(console.error);
        },
        undefined,
        () => {
          setEose(true);
        }
      );
    },
    [activeAccount.id, follows, pool, relays]
  );

  const isNoteExist = useCallback(async () => {
    invoke('count_total_notes').then((res: number) => {
      if (res > 0) {
        const parseDate = new Date(lastLogin);
        fetchData(parseDate);
      } else {
        fetchData(hoursAgo(24, now.current));
      }
    });
  }, [fetchData, lastLogin]);

  useEffect(() => {
    if (eose === false) {
      isNoteExist();
    } else {
      router.replace('/newsfeed/following');
    }

    return () => {
      unsubscribe.current;
    };
  }, [router, eose, isNoteExist]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* dragging area */}
      <div data-tauri-drag-region className="absolute left-0 top-0 z-20 h-16 w-full bg-transparent" />
      {/* end dragging area */}
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <LumeSymbol className="h-16 w-16 text-black dark:text-white" />
          <div className="text-center">
            <h3 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">Loading...</h3>
            <p className="font-medium text-zinc-300 dark:text-zinc-600">
              Keep calm as Lume fetches events... &#129305;
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
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return <BaseLayout>{page}</BaseLayout>;
};
