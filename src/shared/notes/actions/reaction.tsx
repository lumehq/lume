import * as Popover from '@radix-ui/react-popover';
import { useCallback, useEffect, useState } from 'react';

import { ReactionIcon } from '@shared/icons';

import { usePublish } from '@utils/hooks/usePublish';

const REACTIONS = [
  {
    content: '👏',
    img: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Clapping%20Hands.png',
  },
  {
    content: '🤪',
    img: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Tongue.png',
  },
  {
    content: '😮',
    img: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Open%20Mouth.png',
  },
  {
    content: '😢',
    img: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png',
  },
  {
    content: '🤡',
    img: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Clown%20Face.png',
  },
];

export function NoteReaction({ id, pubkey }: { id: string; pubkey: string }) {
  const [open, setOpen] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  const publish = usePublish();

  const getReactionImage = (content: string) => {
    const reaction: { img: string } = REACTIONS.find((el) => el.content === content);
    return reaction.img;
  };

  const react = async (content: string) => {
    setReaction(content);

    const event = await publish({
      content: content,
      kind: 7,
      tags: [
        ['e', id],
        ['p', pubkey],
      ],
    });

    if (event) {
      setOpen(false);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="group inline-flex h-7 w-7 items-center justify-center"
        >
          {reaction ? (
            <img src={getReactionImage(reaction)} alt={reaction} className="h-6 w-6" />
          ) : (
            <ReactionIcon className="h-5 w-5 text-zinc-300 group-hover:text-red-400" />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="select-none rounded-md border-t border-zinc-600/50 bg-zinc-700 px-1 py-1 text-sm leading-none text-zinc-100 will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={0}
          side="top"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => react('👏')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-zinc-600"
            >
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Clapping%20Hands.png"
                alt="Clapping Hands"
                className="h-6 w-6"
              />
            </button>
            <button
              type="button"
              onClick={() => react('🤪')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-600"
            >
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Tongue.png"
                alt="Face with Tongue"
                className="h-6 w-6"
              />
            </button>
            <button
              type="button"
              onClick={() => react('😮')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-600"
            >
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Open%20Mouth.png"
                alt="Face with Open Mouth"
                className="h-6 w-6"
              />
            </button>
            <button
              type="button"
              onClick={() => react('😢')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-600"
            >
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png"
                alt="Crying Face"
                className="h-6 w-6"
              />
            </button>
            <button
              type="button"
              onClick={() => react('🤡')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-600"
            >
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Clown%20Face.png"
                alt="Clown Face"
                className="h-6 w-6"
              />
            </button>
          </div>
          <Popover.Arrow className="fill-zinc-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
