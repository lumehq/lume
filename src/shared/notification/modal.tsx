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
          className="inline-flex h-9 w-9 transform items-center justify-center rounded-md bg-white/20 active:translate-y-1"
        >
          <BellIcon className="h-4 w-4 text-white" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10">
            <div className="h-min w-full shrink-0 rounded-t-xl border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Notification
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-tight text-white/50">
                  All things happen when you rest in 24 hours ago
                </Dialog.Description>
              </div>
            </div>
            <div className="scrollbar-hide flex h-[500px] flex-col divide-y divide-white/10 overflow-y-auto overflow-x-hidden">
              {status === 'loading' ? (
                <div className="inline-flex items-center justify-center px-4 py-3">
                  <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
                </div>
              ) : data.length < 1 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="mb-1 text-4xl">🎉</p>
                  <p className="font-medium text-white/50">
                    Yo!, you&apos;ve no new notifications
                  </p>
                </div>
              ) : (
                data.map((event) => renderItem(event))
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
