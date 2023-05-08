import { NoteContent } from '@lume/app/note/components/content';
import NoteFile from '@lume/app/note/components/file';
import { NoteDefaultUser } from '@lume/app/note/components/user/default';
import { NoteWrapper } from '@lume/app/note/components/wrapper';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { noteParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWRSubscription from 'swr/subscription';

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
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
    <NoteWrapper href={`/app/note?id=${id}`} className="mt-3 rounded-lg border border-zinc-800 px-3 py-3">
      {data ? (
        <>
          <NoteDefaultUser pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-1 pl-[46px]">
            {kind1 && <NoteContent content={kind1} />}
            {kind1063 && <NoteFile url={kind1063[0][1]} />}
          </div>
        </>
      ) : (
        <Skeleton baseColor="#27272a" containerClassName="flex-1" />
      )}
    </NoteWrapper>
  );
});
