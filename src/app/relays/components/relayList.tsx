import { useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from '@tauri-apps/plugin-dialog';
import { normalizeRelayUrl } from 'nostr-fetch';
import { useNavigate } from 'react-router-dom';
import { VList } from 'virtua';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon, PlusIcon, ShareIcon } from '@shared/icons';
import { User } from '@shared/user';

import { useNostr } from '@utils/hooks/useNostr';

export function RelayList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { getAllRelaysByUsers } = useNostr();
  const { db } = useStorage();
  const { status, data } = useQuery({
    queryKey: ['relays'],
    queryFn: async () => {
      return await getAllRelaysByUsers();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const inspectRelay = (relayUrl: string) => {
    const url = new URL(relayUrl);
    navigate(`/relays/${url.hostname}`);
  };

  const connectRelay = async (relayUrl: string) => {
    const url = normalizeRelayUrl(relayUrl);
    const res = await db.createRelay(url);

    if (!res) await message("You're aldready connected to this relay");
    queryClient.invalidateQueries({
      queryKey: ['user-relay'],
    });
  };

  return (
    <div className="col-span-2 border-r border-neutral-100 dark:border-neutral-900">
      {status === 'pending' ? (
        <div className="flex h-full w-full items-center justify-center pb-10">
          <div className="inline-flex flex-col items-center justify-center gap-2">
            <LoaderIcon className="h-5 w-5 animate-spin text-neutral-900 dark:text-neutral-100" />
            <p>Loading relay...</p>
          </div>
        </div>
      ) : (
        <VList className="h-full">
          <div className="inline-flex h-16 w-full items-center border-b border-neutral-100 px-3 dark:border-neutral-900">
            <h3 className="font-semibold text-neutral-950 dark:text-neutral-50">
              All relays
            </h3>
          </div>
          {[...data].map(([key, value]) => (
            <div
              key={key}
              className="flex h-14 w-full items-center justify-between border-b border-neutral-100 px-3 dark:border-neutral-900"
            >
              <div className="inline-flex items-center gap-2 divide-x divide-neutral-100 dark:divide-neutral-900">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => inspectRelay(key)}
                    className="inline-flex h-6 items-center justify-center gap-1 rounded bg-neutral-200 px-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <ShareIcon className="h-3 w-3" />
                    Inspect
                  </button>
                  <button
                    type="button"
                    onClick={() => connectRelay(key)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-neutral-900 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                </div>
                <div className="inline-flex items-center gap-2 pl-3">
                  <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    Relay:{' '}
                  </span>
                  <span className="max-w-[200px] truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {key}
                  </span>
                </div>
              </div>
              <div className="isolate flex -space-x-2">
                {value.slice(0, 4).map((item) => (
                  <User key={item} pubkey={item} variant="stacked" />
                ))}
                {value.length > 4 ? (
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700">
                    <span className="text-xs font-medium">+{value.length}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </VList>
      )}
    </div>
  );
}
