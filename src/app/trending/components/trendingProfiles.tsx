import { useQuery } from '@tanstack/react-query';

import { Profile } from '@app/trending/components/profile';

import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

export function TrendingProfiles() {
  const { status, data, error } = useQuery(['trending-profiles'], async () => {
    const res = await fetch('https://api.nostr.band/v0/trending/profiles');
    if (!res.ok) {
      throw new Error('Error');
    }
    return res.json();
  });

  return (
    <div className="scrollbar-hide relative h-full w-[400px] shrink-0 overflow-y-auto bg-white/10 pb-20">
      <TitleBar title="Trending Profiles" />
      <div className="h-full">
        {error && <p>Failed to fetch</p>}
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="shadow-input rounded-md bg-zinc-900 px-3 py-3 shadow-black/20">
              <NoteSkeleton />
            </div>
          </div>
        ) : (
          <div className="relative flex w-full flex-col gap-3 px-3 pt-1.5">
            {data.profiles.map((item) => (
              <Profile key={item.pubkey} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
