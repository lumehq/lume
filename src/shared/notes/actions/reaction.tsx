import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

import { ReactionIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

const REACTIONS = [
  {
    content: '👏',
    img: '/clapping_hands.png',
  },
  {
    content: '🤪',
    img: '/face_with_tongue.png',
  },
  {
    content: '😮',
    img: '/face_with_open_mouth.png',
  },
  {
    content: '😢',
    img: '/crying_face.png',
  },
  {
    content: '🤡',
    img: '/clown_face.png',
  },
];

export function NoteReaction({ id, pubkey }: { id: string; pubkey: string }) {
  const [open, setOpen] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  const { publish } = useNostr();

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
            <ReactionIcon className="h-5 w-5 text-white group-hover:text-red-400" />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="select-none rounded-md bg-black px-1 py-1 text-sm will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={0}
          side="top"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => react('👏')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
            >
              <img src="/clapping_hands.png" alt="Clapping Hands" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => react('🤪')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
            >
              <img
                src="/face_with_tongue.png"
                alt="Face with Tongue"
                className="h-6 w-6"
              />
            </button>
            <button
              type="button"
              onClick={() => react('😮')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
            >
              <img
                src="/face_with_open_mouth.png"
                alt="Face with Open Mouth"
                className="h-6 w-6"
              />
            </button>
            <button
              type="button"
              onClick={() => react('😢')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
            >
              <img src="/crying_face.png" alt="Crying Face" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => react('🤡')}
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
            >
              <img src="/clown_face.png" alt="Clown Face" className="h-6 w-6" />
            </button>
          </div>
          <Popover.Arrow className="fill-black" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
