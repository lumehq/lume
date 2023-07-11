import { Dialog, Transition } from '@headlessui/react';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useState } from 'react';

import { useNDK } from '@libs/ndk/provider';

import { BellIcon, CancelIcon, LoaderIcon } from '@shared/icons';
import { NotificationUser } from '@shared/notification/user';
import { User } from '@shared/user';

import { nHoursAgo } from '@utils/date';
import { LumeEvent } from '@utils/types';

export function NotificationModal({ pubkey }: { pubkey: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { fetcher, relayUrls } = useNDK();
  const { status, data } = useQuery(
    ['notification', pubkey],
    async () => {
      const events = await fetcher.fetchAllEvents(
        relayUrls,
        { '#p': [pubkey], kinds: [1, 6, 7, 9735] },
        { since: nHoursAgo(48) },
        { sort: true }
      );
      return events as unknown as LumeEvent[];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const renderItem = (event: NDKEvent) => {
    if (event.kind === 1) {
      return (
        <div key={event.id} className="flex flex-col px-5 py-2">
          <User pubkey={event.pubkey} time={event.created_at} isChat={true} />
          <div className="-mt-[20px] pl-[49px]">
            <p className="select-text whitespace-pre-line break-words text-base text-zinc-100">
              {event.content}
            </p>
          </div>
        </div>
      );
    }

    if (event.kind === 6) {
      return (
        <div key={event.id} className="flex flex-col px-5 py-2">
          <NotificationUser pubkey={event.pubkey} desc="repost your post" />
        </div>
      );
    }

    if (event.kind === 7) {
      return (
        <div key={event.id} className="flex flex-col px-5 py-2">
          <NotificationUser pubkey={event.pubkey} desc="liked your post" />
        </div>
      );
    }

    if (event.kind === 9735) {
      return (
        <div key={event.id} className="flex flex-col px-5 py-2">
          <NotificationUser pubkey={event.pubkey} desc="zapped your post" />
        </div>
      );
    }

    return <div className="flex flex-col px-5 py-2">{event.content}</div>;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        aria-label="Notification"
        className="inline-flex h-9 w-9 transform items-center justify-center rounded-md border-t border-zinc-700/50 bg-zinc-800 active:translate-y-1"
      >
        <BellIcon className="h-4 w-4 text-zinc-400" />
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border-t border-zinc-800/50 bg-zinc-900">
                <div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-none text-zinc-100"
                      >
                        Notification
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
                      >
                        <CancelIcon className="h-5 w-5 text-zinc-300" />
                      </button>
                    </div>
                    <Dialog.Description className="text-sm leading-tight text-zinc-400">
                      All things happen when you rest in 48 hours ago
                    </Dialog.Description>
                  </div>
                </div>
                <div className="flex h-[500px] flex-col overflow-y-auto overflow-x-hidden pb-5">
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
