import { RelayContext } from '@components/contexts/relay';

import { dateToUnix } from '@utils/getDate';

import * as Dialog from '@radix-ui/react-dialog';
import { SizeIcon } from '@radix-ui/react-icons';
import { useLocalStorage } from '@rehooks/local-storage';
import * as commands from '@uiw/react-md-editor/lib/commands';
import dynamic from 'next/dynamic';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useState } from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

export default function FormBasic() {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [value, setValue] = useState('');

  const [currentUser]: any = useLocalStorage('current-user');
  const pubkey = currentUser.id;
  const privkey = currentUser.privkey;

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

        relayPool.publish(event, relays);
        setValue('');
      }
    },
  };

  return (
    <Dialog.Root>
      <div className="p-3">
        <div className="relative h-32 w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
          <div>
            <textarea
              name="content"
              onChange={(e) => setValue(e.target.value)}
              placeholder="What's your thought?"
              className="relative h-32 w-full resize-none rounded-lg border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
              spellCheck={false}
            />
          </div>
          <div className="absolute bottom-2 w-full px-2">
            <div className="flex w-full items-center justify-between bg-zinc-800">
              <div className="flex items-center gap-2 divide-x divide-zinc-700">
                <Dialog.Trigger asChild>
                  <span className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
                    <SizeIcon className="h-4 w-4 text-zinc-400" />
                  </span>
                </Dialog.Trigger>
                <div className="flex items-center gap-2 pl-2">
                  <span className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                      />
                    </svg>
                  </span>
                  <span className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600">
                  <span className="text-white drop-shadow">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg text-zinc-100 shadow-modal transition-all">
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
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
