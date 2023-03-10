import { RelayContext } from '@components/contexts/relay';

import { dateToUnix } from '@utils/getDate';

import * as Dialog from '@radix-ui/react-dialog';
import { useLocalStorage } from '@rehooks/local-storage';
import * as commands from '@uiw/react-md-editor/lib/commands';
import dynamic from 'next/dynamic';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useState } from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

export default function CreatePost() {
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
      <Dialog.Trigger asChild>
        <div className="flex flex-col gap-1.5">
          <div className="relative h-16 shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
            <textarea
              readOnly
              placeholder="What's your thought?"
              className="relative h-16 w-full resize-none rounded-lg border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
            />
          </div>
          <button className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 text-sm font-semibold shadow-input">
            <span className="drop-shadow-lg">Post</span>
          </button>
        </div>
      </Dialog.Trigger>
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
