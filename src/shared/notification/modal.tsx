import { NDKEvent } from '@nostr-dev-kit/ndk';
import * as Dialog from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { BellIcon, CancelIcon, LoaderIcon } from '@shared/icons';
import { NotiMention, NotiReaction, NotiRepost } from '@shared/notification';

import { nHoursAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

export function NotificationModal({ pubkey }: { pubkey: string }) {
  const { fetcher, relayUrls } = useNDK();
  const { status, data } = useQuery(
    ['notification', pubkey],
    async () => {
      const events = await fetcher.fetchAllEvents(
        relayUrls,
        { '#p': [pubkey], kinds: [1, 6, 7, 9735] },
        { since: nHoursAgo(24) }
      );
      const filterSelf = events.filter((el) => el.pubkey !== pubkey);
      const sorted = filterSelf.sort((a, b) => a.created_at - b.created_at);
      return sorted as unknown as LumeEvent[];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case 1:
          return <NotiMention key={event.id} event={event} />;
        case 6:
          return <NotiRepost key={event.id} event={event} />;
        case 7:
          return <NotiReaction key={event.id} event={event} />;
        default:
          return null;
      }
    },
    [data]
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-9 transform items-center justify-center rounded-md border-t border-zinc-700/50 bg-zinc-800 active:translate-y-1"
        >
          <BellIcon className="h-4 w-4 text-zinc-400" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-[1000px] bg-black bg-opacity-30 backdrop-blur-md data-[state=open]:animate-overlayShow" />
        <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center data-[state=open]:animate-contentShow">
          <Dialog.Content className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border-t border-zinc-800/50 bg-zinc-900">
            <div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-zinc-100">
                    Notification
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
                    >
                      <CancelIcon className="h-5 w-5 text-zinc-300" />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-tight text-zinc-400">
                  All things happen when you rest in 24 hours ago
                </Dialog.Description>
              </div>
            </div>
            <div className="scrollbar-hide flex h-[500px] flex-col overflow-y-auto overflow-x-hidden pb-5">
              {status === 'loading' ? (
                <div className="inline-flex items-center justify-center px-4 py-3">
                  <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
                </div>
              ) : data.length < 1 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="mb-1 text-4xl">🎉</p>
                  <p className="font-medium text-zinc-500">
                    Yo!, you&apos;ve no new notifications
                  </p>
                </div>
              ) : (
                data.map((event) => renderItem(event))
              )}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
