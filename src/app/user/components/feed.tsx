import { NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { Note } from '@shared/notes/note';

import { dateToUnix, getHourAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

export function UserFeed({ pubkey }: { pubkey: string }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(['user-feed', pubkey], async () => {
    const now = new Date();
    const filter: NDKFilter = {
      kinds: [1],
      authors: [pubkey],
      since: dateToUnix(getHourAgo(48, now)),
    };
    const events = await ndk.fetchEvents(filter);
    return [...events];
  });

  return (
    <div className="w-full max-w-[400px] px-2 pb-10">
      {status === 'loading' ? (
        <div className="px-3">
          <p>Loading...</p>
        </div>
      ) : (
        data.map((note: LumeEvent) => <Note key={note.id} event={note} />)
      )}
    </div>
  );
}
