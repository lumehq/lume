import { NoteContent } from '@lume/app/note/components/content';
import NoteMetadata from '@lume/app/note/components/metadata';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { noteParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWRSubscription from 'swr/subscription';

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
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
    <div className="relative pb-5">
      <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
      <div className="relative z-10 flex flex-col">
        {data ? (
          <>
            <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
            <div className="mt-1 pl-[52px]">
              <NoteContent content={content} />
              <NoteMetadata id={data.id} eventPubkey={data.pubkey} />
            </div>
          </>
        ) : (
          <Skeleton baseColor="#27272a" containerClassName="flex-1" />
        )}
      </div>
    </div>
  );
});
