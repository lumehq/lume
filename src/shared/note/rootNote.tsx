import { NoteMetadata } from '@lume/shared/note/metadata';
import { RelayContext } from '@lume/shared/relaysProvider';
import { UserExtend } from '@lume/shared/user/extend';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { contentParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';
import { navigate } from 'vite-plugin-ssr/client/router';

export const RootNote = memo(function RootNote({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);

  const openThread = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(`/newsfeed/note?id=${id}`);
    } else {
      e.stopPropagation();
    }
  };

  const { data, error } = useSWRSubscription(
    id
      ? [
          {
            ids: [id],
            kinds: [1],
          },
        ]
      : null,
    (key, { next }) => {
      const unsubscribe = pool.subscribe(
        key,
        READONLY_RELAYS,
        (event: any) => {
          next(null, event);
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
    }
  );

  return (
    <>
      {error && <div>failed to load</div>}
      {!data ? (
        <div className="h-6 w-full animate-pulse select-text flex-col rounded bg-zinc-800"></div>
      ) : (
        <div onClick={(e) => openThread(e)} className="relative z-10 flex flex-col">
          <UserExtend pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-1 pl-[52px]">
            <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">
              {contentParser(data.content, data.tags)}
            </div>
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
      )}
    </>
  );
});
