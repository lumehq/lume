import { useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from '@tauri-apps/api/dialog';
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
  const { status, data } = useQuery(
    ['relays'],
    async () => {
      return await getAllRelaysByUsers();
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );

  const inspectRelay = (relayUrl: string) => {
    const url = new URL(relayUrl);
    navigate(`/relays/${url.hostname}`);
  };

  const connectRelay = async (relayUrl: string) => {
    const url = normalizeRelayUrl(relayUrl);
    const res = await db.createRelay(url);

    if (!res) await message("You're aldready connected to this relay");
    queryClient.invalidateQueries(['user-relay']);
  };

  return (
    <div className="col-span-2 border-r border-white/5">
      {status === 'loading' ? (
        <div className="flex h-full w-full items-center justify-center pb-10">
          <div className="inline-flex flex-col items-center justify-center gap-2">
            <LoaderIcon className="h-5 w-5 animate-spin text-white" />
            <p>Loading relay...</p>
          </div>
        </div>
      ) : (
        <VList className="scrollbar-hide mt-20 h-full">
          <div className="inline-flex h-16 w-full items-center border-b border-white/5 px-3">
            <h3 className="bg-gradient-to-r from-fuchsia-200 via-red-200 to-orange-300 bg-clip-text font-semibold text-transparent">
              All relays used by your follows
            </h3>
          </div>
          {[...data].map(([key, value]) => (
            <div
              key={key}
              className="flex h-14 w-full items-center justify-between border-b border-white/5 px-3"
            >
              <div className="inline-flex items-center gap-2 divide-x divide-white/10">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => inspectRelay(key)}
                    className="inline-flex h-6 items-center justify-center gap-1 rounded bg-white/10 px-1.5 text-sm font-medium hover:bg-white/20"
                  >
                    <ShareIcon className="h-3 w-3" />
                    Inspect
                  </button>
                  <button
                    type="button"
                    onClick={() => connectRelay(key)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                </div>
                <div className="inline-flex items-center gap-2 pl-3">
                  <span className="text-sm font-semibold text-white/70">Relay: </span>
                  <span className="max-w-[200px] truncate text-sm font-medium text-white">
                    {key}
                  </span>
                </div>
              </div>
              <div className="isolate flex -space-x-2">
                {value.slice(0, 4).map((item) => (
                  <User key={item} pubkey={item} variant="stacked" />
                ))}
                {value.length > 4 ? (
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/80 ring-1 ring-white/10 backdrop-blur-xl">
                    <span className="text-xs font-semibold">+{value.length}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          <div className="h-16" />
        </VList>
      )}
    </div>
  );
}
