import { noteContentAtom } from '@stores/note';

import * as Popover from '@radix-ui/react-popover';
import { Plus } from 'iconoir-react';
import { useAtom } from 'jotai';
import { useState } from 'react';

export default function ImagePicker() {
  const [value, setValue] = useAtom(noteContentAtom);
  const [url, setURL] = useState('');

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      setValue(value + ' ' + url);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
          <Plus width={16} height={16} className="text-zinc-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-80 rounded-md bg-zinc-900/80 p-3 shadow-input shadow-black/50 ring-1 ring-zinc-800 backdrop-blur-xl will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={3}
        >
          <div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-zinc-200">Image URL</label>
              <div className="relative mb-1 shrink-0 before:pointer-events-none before:absolute before:-inset-px before:rounded-[8px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-1 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
                <input
                  placeholder="https://..."
                  onKeyDown={handleEnter}
                  onChange={(e) => setURL(e.target.value)}
                  className="relative w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
                />
              </div>
              <p className="text-sm leading-none text-zinc-500">
                Press <span className="rounded bg-zinc-800 px-1 py-0.5">Enter</span> to insert image
              </p>
            </div>
            <div></div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
