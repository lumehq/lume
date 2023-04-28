import { AccountContext } from '@lume/shared/accountProvider';
import { RelayContext } from '@lume/shared/relaysProvider';
import { UserExtend } from '@lume/shared/user/extend';
import { WRITEONLY_RELAYS } from '@lume/stores/constants';
import { dateToUnix } from '@lume/utils/getDate';

import { Dialog, Transition } from '@headlessui/react';
import { ChatLines, OpenNewWindow } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { Fragment, useContext, useState } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

export const NoteComment = ({
  count,
  eventID,
  eventPubkey,
  eventContent,
  eventTime,
}: {
  count: number;
  eventID: string;
  eventPubkey: string;
  eventTime: number;
  eventContent: any;
}) => {
  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const profile = activeAccount ? JSON.parse(activeAccount.metadata) : null;

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const openThread = () => {
    navigate(`/newsfeed/note?id=${eventID}`);
  };

  const submitEvent = () => {
    const event: any = {
      content: value,
      created_at: dateToUnix(),
      kind: 1,
      pubkey: activeAccount.pubkey,
      tags: [['e', eventID]],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    pool.publish(event, WRITEONLY_RELAYS);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="group flex w-16 items-center gap-1 text-sm text-zinc-500"
      >
        <div className="rounded-md p-1 group-hover:bg-zinc-800">
          <ChatLines width={20} height={20} className="text-zinc-500" />
        </div>
        <span>{count}</span>
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
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md data-[state=open]:animate-overlayShow" />
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
              <Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900">
                {/* root note */}
                <div className="relative z-10 flex flex-col pb-6">
                  <div className="relative z-10">
                    <UserExtend pubkey={eventPubkey} time={eventTime} />
                  </div>
                  <div className="-mt-5 pl-[52px]">
                    <div className="prose prose-zinc max-w-none break-words leading-tight dark:prose-invert prose-headings:mb-2 prose-headings:mt-3 prose-p:m-0 prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-ul:mt-2 prose-li:my-1">
                      {eventContent}
                    </div>
                  </div>
                  {/* divider */}
                  <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
                </div>
                {/* comment form */}
                <div className="flex gap-2">
                  <div>
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
                      <img src={profile?.picture} alt="user's avatar" className="h-11 w-11 rounded-md object-cover" />
                    </div>
                  </div>
                  <div className="relative h-36 w-full flex-1 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
                    <div>
                      <textarea
                        name="content"
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Send your comment"
                        className="relative h-36 w-full resize-none rounded-md border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
                        spellCheck={false}
                      />
                    </div>
                    <div className="absolute bottom-2 w-full px-2">
                      <div className="flex w-full items-center justify-between bg-zinc-800">
                        <div className="flex items-center gap-2 divide-x divide-zinc-700">
                          <button
                            onClick={() => openThread()}
                            className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700"
                          >
                            <OpenNewWindow width={16} height={16} className="text-zinc-400" />
                          </button>
                          <div className="flex items-center gap-2 pl-2"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => submitEvent()}
                            disabled={value.length === 0 ? true : false}
                            className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600"
                          >
                            <span className="text-white drop-shadow">Send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
