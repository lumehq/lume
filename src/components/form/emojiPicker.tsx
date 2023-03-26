import { noteContentAtom } from '@stores/note';

import EmojiIcon from '@assets/icons/emoji';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import * as Popover from '@radix-ui/react-popover';
import { useAtom } from 'jotai';

export default function EmojiPicker() {
  const [value, setValue] = useAtom(noteContentAtom);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700">
          <EmojiIcon className="h-[16.5px] w-[16.5px] text-zinc-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-md will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <Picker
            data={data}
            emojiSize={16}
            navPosition={'none'}
            skinTonePosition={'none'}
            onEmojiSelect={(res) => setValue(value + ' ' + res.native)}
          />
          <Popover.Arrow className="fill-[#141516]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
