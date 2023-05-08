import { Kind1 } from '@lume/app/note/components/kind1';
import { Kind1063 } from '@lume/app/note/components/kind1063';
import NoteMetadata from '@lume/app/note/components/metadata';
import { NoteSkeleton } from '@lume/app/note/components/skeleton';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { noteParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
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

  const kind1 = !error && data?.kind === 1 ? noteParser(data) : null;
  const kind1063 = !error && data?.kind === 1063 ? data.tags : null;

  return (
    <div className="relative flex flex-col pb-6">
      <div className="absolute left-[16px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
      {data ? (
        <>
          <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-3 pl-[46px]">
            {kind1 && <Kind1 content={kind1} />}
            {kind1063 && <Kind1063 metadata={kind1063} />}
            <NoteMetadata id={data.id} eventPubkey={data.pubkey} />
          </div>
        </>
      ) : (
        <NoteSkeleton />
      )}
    </div>
  );
});
