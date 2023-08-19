import { useQuery } from '@tanstack/react-query';

import { type Profile, UserProfile } from '@app/space/components/userProfile';

import { NoteSkeleton } from '@shared/notes/skeleton';
import { TitleBar } from '@shared/titleBar';

import { Widget } from '@utils/types';

interface Response {
  profiles: Array<{ pubkey: string }>;
}

export function TrendingProfilesWidget({ params }: { params: Widget }) {
  const { status, data } = useQuery(
    ['trending-profiles'],
    async () => {
      const res = await fetch(params.content);
      if (!res.ok) {
        throw new Error('Error');
      }
      const json: Response = await res.json();
      if (!json.profiles) return [];
      return json.profiles;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  return (
    <div className="scrollbar-hide relative h-full w-[400px] shrink-0 overflow-y-auto bg-white/10 pb-20">
      <TitleBar title={params.title} />
      <div className="h-full">
        {status === 'loading' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <NoteSkeleton />
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-white/10 px-3 py-3">
              <p className="text-center text-sm font-medium text-white">
                Sorry, an unexpected error has occurred.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative flex w-full flex-col gap-3 px-3 pt-1.5">
            {data.map((item: Profile) => (
              <UserProfile key={item.pubkey} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
