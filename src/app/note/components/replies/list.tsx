import NoteReplyForm from '@lume/app/note/components/replies/form';
import Reply from '@lume/app/note/components/replies/item';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { sortEvents } from '@lume/utils/transform';

import { useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export default function RepliesList({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);

  const { data, error } = useSWRSubscription(id ? ['note-replies', id] : null, ([, key], { next }) => {
    // subscribe to note
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [key],
          since: 0,
          kinds: [1, 1063],
          limit: 20,
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
        next(null, (prev: any) => (prev ? [...prev, event] : [event]));
      }
    );

    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="mt-5">
      <div className="mb-2">
        <h5 className="text-lg font-semibold text-zinc-300">Replies</h5>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        <div className="flex flex-col divide-y divide-zinc-800">
          <NoteReplyForm id={id} />
          {error && <div>failed to load</div>}
          {!data ? (
            <div className="flex gap-2 px-3 py-4">
              <div className="relative h-9 w-9 shrink animate-pulse rounded-md bg-zinc-800"></div>
              <div className="flex w-full flex-1 flex-col justify-center gap-1">
                <div className="flex items-baseline gap-2 text-sm">
                  <div className="h-2.5 w-20 animate-pulse rounded-sm bg-zinc-800"></div>
                </div>
                <div className="h-4 w-44 animate-pulse rounded-sm bg-zinc-800"></div>
              </div>
            </div>
          ) : (
            sortEvents(data).map((event: any) => {
              return <Reply key={event.id} data={event} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}
