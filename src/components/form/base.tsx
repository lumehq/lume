import EmojiPicker from '@components/form/emojiPicker';
import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { noteContentAtom } from '@stores/note';
import { relaysAtom } from '@stores/relays';

import { dateToUnix } from '@utils/getDate';

import ImageIcon from '@assets/icons/image';

import * as Dialog from '@radix-ui/react-dialog';
import { SizeIcon } from '@radix-ui/react-icons';
import * as commands from '@uiw/react-md-editor/lib/commands';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import dynamic from 'next/dynamic';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useState } from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

export default function FormBase() {
  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);
  const [value, setValue] = useAtom(noteContentAtom);
  const resetValue = useResetAtom(noteContentAtom);

  const [open, setOpen] = useState(false);

  const pubkey = activeAccount.id;
  const privkey = activeAccount.privkey;

  const submitEvent = () => {
    const event: any = {
      content: value,
      created_at: dateToUnix(),
      kind: 1,
      pubkey: pubkey,
      tags: [],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privkey);

    pool.publish(event, relays);
    resetValue;
  };

  const postButton = {
    name: 'post',
    keyCommand: 'post',
    buttonProps: { className: 'cta-btn', 'aria-label': 'Post a message' },
    icon: (
      <div className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
        <span className="text-white drop-shadow">Send</span>
      </div>
    ),
    execute: (state: { text: any }) => {
      if (state.text > 0) {
        submitEvent();
      }
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="p-3">
        <div className="relative h-32 w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
          <div>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              placeholder="What's your thought?"
              className="relative h-32 w-full resize-none rounded-lg border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
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
                  <EmojiPicker />
                  <span className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
                    <ImageIcon className="h-4 w-4 text-zinc-400" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => submitEvent()}
                  disabled={value.length === 0 ? true : false}
                  className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                >
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
