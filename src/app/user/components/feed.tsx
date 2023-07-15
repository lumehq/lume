import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

import { nHoursAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

export function UserFeed({ pubkey }: { pubkey: string }) {
  const { fetcher, relayUrls } = useNDK();
  const { status, data } = useQuery(['user-feed', pubkey], async () => {
    const events = await fetcher.fetchAllEvents(
      relayUrls,
      { kinds: [1], authors: [pubkey] },
      { since: nHoursAgo(48) },
      { sort: true }
    );
    return events as unknown as LumeEvent[];
  });

  return <div className="w-full max-w-[400px] px-2 pb-10"></div>;
}
