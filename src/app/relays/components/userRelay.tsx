import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function UserRelay() {
  const { relayUrls } = useNDK();
  const { db } = useStorage();
  const { status, data } = useQuery(
    ['user-relay'],
    async () => {
      return await db.getExplicitRelayUrls();
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="mt-3 px-3">
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div
              key={item}
              className="inline-flex h-10 items-center gap-2.5 rounded-lg bg-white/10 px-3"
            >
              {relayUrls.includes(item) ? (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
              ) : (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
              )}
              <p className="text-sm font-medium">{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
