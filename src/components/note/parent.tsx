import { NoteMetadata } from '@components/note/metadata';
import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { READONLY_RELAYS } from '@stores/constants';

import { contentParser } from '@utils/parser';

import { memo, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);

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
    <div className="relative pb-5">
      {error && <div>failed to load</div>}
      {!data ? (
        <div className="animated-pulse">
          <div className="flex items-start gap-2">
            <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
            <div className="flex w-full flex-1 items-start justify-between">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-16 rounded bg-zinc-700" />
                  <span className="text-zinc-500">·</span>
                  <div className="h-4 w-12 rounded bg-zinc-700" />
                </div>
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
      ) : (
        <>
          <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
          <div className="relative z-10 flex flex-col">
            <UserExtend pubkey={data.pubkey} time={data.created_at} />
            <div className="mt-1 pl-[52px]">
              <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">
                {contentParser(data.content, data.tags)}
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
              <NoteMetadata
                eventID={data.event_id}
                eventPubkey={data.pubkey}
                eventContent={data.content}
                eventTime={data.created_at}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
});
