import { RelayContext } from '@lume/shared/relaysProvider';
import { UserExtend } from '@lume/shared/user/extend';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { contentParser } from '@lume/utils/parser';

import { memo, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export const NoteQuote = memo(function NoteQuote({ id }: { id: string }) {
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
    <div className="relative mb-2 mt-3 rounded-lg border border-zinc-700 bg-zinc-800 p-2 py-3">
      {error && <div>failed to load</div>}
      {!data ? (
        <div className="h-6 w-full animate-pulse select-text flex-col rounded bg-zinc-800"></div>
      ) : (
        <div className="relative z-10 flex flex-col">
          <UserExtend pubkey={data.pubkey} time={data.created_at} />
          <div className="mt-1 pl-[52px]">
            <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">
              {contentParser(data.content, data.tags)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
