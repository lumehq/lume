import { useQuery, useQueryClient } from '@tanstack/react-query';

import { RelayForm } from '@app/relays/components/relayForm';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { CancelIcon } from '@shared/icons';

export function UserRelay() {
  const queryClient = useQueryClient();

  const { relayUrls } = useNDK();
  const { db } = useStorage();
  const { status, data } = useQuery(
    ['user-relay'],
    async () => {
      return await db.getExplicitRelayUrls();
    },
    { refetchOnWindowFocus: false }
  );

  const removeRelay = async (relayUrl: string) => {
    await db.removeRelay(relayUrl);
    queryClient.invalidateQueries(['user-relay']);
  };

  return (
    <div className="mt-3 px-3">
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div
              key={item}
              className="group flex h-10 items-center justify-between rounded-lg bg-white/10 pl-3 pr-1.5"
            >
              <div className="inline-flex items-center gap-2.5">
                {relayUrls.includes(item) ? (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                ) : (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                )}
                <p className="max-w-[20rem] truncate text-sm font-medium leading-none">
                  {item}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeRelay(item)}
                className="hidden h-6 w-6 items-center justify-center rounded hover:bg-white/10 group-hover:inline-flex"
              >
                <CancelIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
          <RelayForm />
        </div>
      )}
    </div>
  );
}
