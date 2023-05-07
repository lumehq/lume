import { NoteContent } from '@lume/app/note/components/content';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { NoteWrapper } from '@lume/app/note/components/wrapper';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { noteParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWRSubscription from 'swr/subscription';

export const NoteQuote = memo(function NoteQuote({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);

  const { data, error } = useSWRSubscription(id ? id : null, (key, { next }) => {
    const unsubscribe = pool.subscribe(
      [
        {
          ids: [key],
        },
      ],
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
  });

  const content = !error && data ? noteParser(data) : null;

  return (
    <NoteWrapper
      href={`/app/note?id=${id}`}
      className="mb-2 mt-3 flex flex-col rounded-lg border border-zinc-800 p-2 py-3"
    >
      {data ? (
        <>
          <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-1 pl-[52px]">
            <NoteContent content={content} />
          </div>
        </>
      ) : (
        <Skeleton baseColor="#27272a" containerClassName="flex-1" />
      )}
    </NoteWrapper>
  );
});
