import { NoteMetadata } from '@components/note/metadata';
import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { contentParser } from '@utils/parser';

import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

export const RootNote = memo(function RootNote({ event }: { event: any }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [data, setData] = useState(null);
  const [content, setContent] = useState('');

  const openUserPage = (e) => {
    e.stopPropagation();
    navigate(`/user?pubkey=${event.pubkey}`);
  };

  const openThread = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/newsfeed/note?id=${event.parent_id}`);
    } else {
      e.stopPropagation();
    }
  };

  const fetchEvent = useCallback(
    async (id: string) => {
      const unsubscribe = pool.subscribe(
        [
          {
            ids: [id],
            kinds: [1],
          },
        ],
        relays,
        (event: any) => {
          setData(event);
          setContent(contentParser(event.content, event.tags));
        },
        undefined,
        undefined,
        {
          unsubscribeOnEose: true,
        }
      );

      return () => {
        unsubscribe();
      };
    },
    [pool, relays]
  );

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      if (typeof event === 'object') {
        setData(event);
        setContent(contentParser(event.content, event.tags));
      } else {
        fetchEvent(event);
      }
    }

    return () => {
      ignore = true;
    };
  }, [event, fetchEvent]);

  if (data) {
    return (
      <div onClick={(e) => openThread(e)} className="relative z-10 flex flex-col">
        <div onClick={(e) => openUserPage(e)}>
          <UserExtend pubkey={data.pubkey} time={data.created_at} />
        </div>
        <div className="mt-1 pl-[52px]">
          <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">{content}</div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
          <NoteMetadata
            eventID={data.id}
            eventPubkey={data.pubkey}
            eventContent={data.content}
            eventTime={data.created_at}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative z-10 flex h-min animate-pulse select-text flex-col pb-5">
        <div className="flex items-start gap-2">
          <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
          <div className="flex w-full flex-1 items-start justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-16 rounded bg-zinc-700" />
                <span className="text-zinc-500">·</span>
                <div className="h-4 w-12 rounded bg-zinc-700" />
              </div>
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
            </div>
          </div>
        </div>
        <div className="-mt-5 pl-[52px]">
          <div className="flex flex-col gap-6">
            <div className="h-16 w-full rounded bg-zinc-700" />
            <div className="flex items-center gap-8">
              <div className="h-4 w-12 rounded bg-zinc-700" />
              <div className="h-4 w-12 rounded bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
