import { channelReplyAtom } from '@stores/channel';

import ReplyIcon from '@assets/icons/reply';

import * as Tooltip from '@radix-ui/react-tooltip';
import { useSetAtom } from 'jotai';

export const ReplyButton = ({ id, pubkey, content }: { id: string; pubkey: string; content: string }) => {
  const setChannelReplyAtom = useSetAtom(channelReplyAtom);

  const createReply = () => {
    setChannelReplyAtom({ id: id, pubkey: pubkey, content: content });
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={() => createReply()}
            className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-800"
          >
            <ReplyIcon className="h-4 w-4 text-zinc-400" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="select-none rounded-md bg-zinc-800 px-4 py-2 text-sm leading-none text-zinc-100 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={4}
          >
            Reply
            <Tooltip.Arrow className="fill-zinc-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
