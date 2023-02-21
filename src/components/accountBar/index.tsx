/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from '@components/accountBar/account';

import { currentUser } from '@stores/currentUser';

import LumeIcon from '@assets/icons/Lume';
import MiniPlusIcon from '@assets/icons/MiniPlus';
import PostIcon from '@assets/icons/Post';

import { Dialog, Transition } from '@headlessui/react';
import { useStore } from '@nanostores/react';
import * as commands from '@uiw/react-md-editor/lib/commands';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { dateToUnix, useNostr } from 'nostr-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

export default function AccountBar() {
  const { publish } = useNostr();

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [users, setUsers] = useState([]);

  const $currentUser: any = useStore(currentUser);
  const pubkey = $currentUser.pubkey;
  const privkey = $currentUser.privkey;

  const postButton = {
    name: 'post',
    keyCommand: 'post',
    buttonProps: { className: 'cta-btn', 'aria-label': 'Post a message' },
    icon: (
      <div className="relative inline-flex h-10 w-16 transform cursor-pointer overflow-hidden rounded bg-zinc-900 px-2.5 ring-zinc-500/50 ring-offset-zinc-900 will-change-transform focus:outline-none focus:ring-1 focus:ring-offset-2 active:translate-y-1">
        <span className="absolute inset-px z-10 inline-flex items-center justify-center rounded bg-zinc-900 text-zinc-200">
          Post
        </span>
        <span className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-gray-300 before:via-fuchsia-600 before:to-orange-600"></span>
      </div>
    ),
    execute: (state: { text: any }) => {
      const message = state.text;

      if (message.length > 0) {
        const event: any = {
          content: message,
          created_at: dateToUnix(),
          kind: 1,
          pubkey: pubkey,
          tags: [],
        };

        event.id = getEventHash(event);
        event.sig = signEvent(event, privkey);

        publish(event);
        setValue('');
      }
    },
  };

  const getAccounts = useCallback(async () => {
    const db = await Database.load('sqlite:lume.db');
    const result: any = await db.select('SELECT * FROM accounts');

    setUsers(result);
  }, []);

  useEffect(() => {
    getAccounts().catch(console.error);
  }, [getAccounts]);

  return (
    <div className="flex h-full flex-col items-center justify-between px-2 pt-12 pb-4">
      <div className="flex flex-col gap-3">
        {users.map((user, index) => (
          <Account key={index} user={user} current={$currentUser.pubkey} />
        ))}
        <Link
          href="/onboarding"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-600 hover:border-zinc-400">
          <MiniPlusIcon className="h-6 w-6 text-zinc-400 group-hover:text-zinc-200" />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {/* post button */}
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex h-11 w-11 transform items-center justify-center rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 font-bold text-white shadow-lg active:translate-y-1">
          <PostIcon className="h-4 w-4" />
        </button>
        {/* end post button */}
        <LumeIcon className="h-8 w-auto text-zinc-700" />
      </div>
      {/* modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-lg text-zinc-100 shadow-modal transition-all">
                  <div className="absolute top-0 left-0 h-full w-full bg-black bg-opacity-20 backdrop-blur-lg"></div>
                  <div className="absolute bottom-0 left-0 h-24 w-full border-t border-white/10 bg-zinc-900"></div>
                  <div className="relative z-10 px-4 pt-4 pb-2">
                    <MDEditor
                      value={value}
                      preview={'edit'}
                      height={200}
                      minHeight={200}
                      visibleDragbar={false}
                      highlightEnable={false}
                      defaultTabEnable={true}
                      autoFocus={true}
                      commands={[
                        commands.bold,
                        commands.italic,
                        commands.strikethrough,
                        commands.divider,
                        commands.checkedListCommand,
                        commands.unorderedListCommand,
                        commands.orderedListCommand,
                        commands.divider,
                        commands.link,
                        commands.image,
                      ]}
                      extraCommands={[postButton]}
                      textareaProps={{
                        placeholder: "What's your thought?",
                      }}
                      onChange={(val) => setValue(val)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* end modal */}
    </div>
  );
}
